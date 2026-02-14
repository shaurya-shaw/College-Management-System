import { ClassSession } from "../models/classSession.model";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";

const enrollStudent = async (req, res) => {
  try {
    const { userId, classSessionId } = req.body;

    if (!userId && !classSessionId) {
      return res
        .status(400)
        .json({ message: "userId and classSessionId are required" });
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user && user.role !== "STUDENT") {
      return res.status(400).json({ message: "student not found" });
    }

    const classes = await ClassSession.findById(classSessionId);

    if (!classes) {
      return res.status(400).json({ message: "class session not found" });
    }

    if (user.branch.toString() !== classes.branch.toString()) {
      return res
        .status(400)
        .json({ message: "student and class session branch mismatch" });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      classSession: classSessionId,
    });

    if (!enrollment) {
      return res.status(500).json({ message: "enrollment failed" });
    }
    return res.status(201).json({
      message: "student enrolled successfully",
      enrollment: enrollment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while enrolling student",
      error: error.message,
    });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({
        path: "user",
        select: "fullName email",
      })
      .populate({
        path: "classSession",
        populate: [
          { path: "subject", select: "name" },
          { path: "teacher", select: "fullName email" },
          { path: "branch", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    if (enrollments.length == 0) {
      return res.status(404).json({ message: "enrollments not found" });
    }
    return res.status(200).json({
      message: "enrollments fetched successfully",
      enrollments: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching enrollments",
      error: error.message,
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const AllClassesEnroll = await Enrollment.find({
      user: req.user._id,
    })
      .populate({
        path: "classSession",
        select: "timeSlot day",
        populate: [
          { path: "subject", select: "name" },
          { path: "teacher", select: "fullName" },
        ],
      })
      .lean(); //faster response, removes mongoose overhead
    if (AllClassesEnroll.length === 0) {
      return res.status(404).json({ message: "enrollments not found" });
    }
    return res.status(200).json({
      message: "enrollments fetched successfully",
      enrollments: AllClassesEnroll,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching enrollments",
      error: error.message,
    });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const { enrollId } = req.params;
    if (!enrollId) {
      return res.status(400).json({ message: "enrollId is required" });
    }
    await Enrollment.findByIdAndDelete(enrollId);
    return res.status(200).json({ message: "enrollment deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting enrollment",
      error: error.message,
    });
  }
};

const getAllStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }
    const classes = await ClassSession.findById(classId);

    if (!classes) {
      return res.status(400).json({ message: "class session not found" });
    }
    if (classes.teacher !== req.user._id) {
      return res.status(403).json({
        message: "you are not authorized to view students in this class",
      });
    }
    const enrollments = await Enrollment.find({ classSession: classId })
      .populate({
        path: "user",
        select: "fullName email branch",
      })
      .lean();

    const students = enrollments.map((e) => e.user);
    return res
      .status(200)
      .json({ message: "students fetched successfully", students: students });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching students",
      error: error.message,
    });
  }
};

export {
  enrollStudent,
  getEnrollments,
  getMyEnrollments,
  deleteEnrollment,
  getAllStudentsInClass,
};
