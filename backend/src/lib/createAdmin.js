import { User } from "../models/user.model.js";

export const createAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "ADMIN" });
    if (!admin) {
      const newAdmin = await User.create({
        fullName: process.env.ADMIN_FULL_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "ADMIN",
      });
      console.log("admin created successfully", newAdmin);
    }
  } catch (error) {
    console.log(error);
  }
};
