import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong while generating referesh and access token",
      error: error.message,
    });
  }
};

const addUser = async (req, res) => {
  //toke user data from req
  //check if its empty or not
  //check if user already exists
  //create a user
  //remove password and refresh token from user
  //check if user created

  try {
    const { fullName, email, password, role, branch } = req.body;

    if (
      [fullName, email, password, role, branch].some((field) => {
        field.trim() == "";
      })
    ) {
      return res.status(401).json({ message: "all fields are required" });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(409).json({ message: "user already exists" });
    }
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      branch,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      return res.status(500).json({ message: "user not created" });
    }
    return res
      .status(201)
      .json({ message: "user created successfully", user: createdUser });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while creating user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  //take input from req.body
  //check if its empty
  //find user
  //password check
  //generate access and refresh token
  //save tokens in cookies
  //return user

  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!loggedInUser) {
      return res
        .status(500)
        .json({ message: "something went wrong while login in user" });
    }
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "login successfull", user: loggedInUser });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while login in user",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //to remove field from document
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(203)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
  try {
    const decodedToken = jwt.verify(
      //check if token is expired or not
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(404).json({ message: "Invalid refresh token" });
    }
    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token expires, please login again" });
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({ message: "Access token refreshed successfully" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid refresh token", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "old password and new password are required" });
    }
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!(await user.isPasswordCorrect(oldPassword))) {
      return res.status(401).json({ message: "old password is incorrect" });
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while changing password",
      error: error.message,
    });
  }
};

const currentUser = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "user not found" });
  }
  res
    .status(200)
    .json({ message: "current user fetched successfully", user: req.user });
};

const updateUserById = async (req, res) => {
  const { userId } = req.params;
  const { fullName, role, branch, email } = req.body;

  if (!fullName || !role || !branch || !email) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName,
        email,
        role,
        branch,
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (!user) {
    return res
      .status(500)
      .json({ message: "something went wrong while updating profile" });
  }
  return res
    .status(200)
    .json({ message: "profile updated successfully", user });
};

const getAllStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "STUDENT" });
    return res
      .status(200)
      .json({ message: "students fetched successfully", users: users });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching students",
      error: error.message,
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const users = await User.find({ role: "TEACHER" });
    return res
      .status(200)
      .json({ message: "teachers fetched successfully", users: users });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching teachers",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await User.findById(userId).select("-password -refreshToken");
    return res.status(200).json({ message: "user fetched successfully", user });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching user",
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting user",
      error: error.message,
    });
  }
};

export {
  addUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  currentUser,
  updateUserById,
  getAllStudents,
  getAllTeachers,
  getUserById,
  deleteUserById,
};
