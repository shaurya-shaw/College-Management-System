import { Branch } from "../models/branch.model.js";
import { Subject } from "../models/subject.model.js";
import { ClassSession } from "../models/classSession.model.js";
import { User } from "../models/user.model.js";
import { Attendance } from "../models/attendance.model.js";

const createClassSession = async (req, res) => {
  try {
    const { subject, teacher, branch, timeSlot, day } = req.body;
    if (!subject || !teacher || !branch || !timeSlot || !day) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const bran = await Branch.findOne({ name: branch });
    const sub = await Subject.findOne({ name: subject });
    const teach = await User.findOne({ fullName: teacher, role: "TEACHER" });

    const newClassSession = await ClassSession.create({
      subject: sub._id,
      teacher: teach._id,
      branch: bran._id,
      timeSlot,
      day,
    });
    if (!newClassSession) {
      return res
        .status(500)
        .json({ message: "Failed to create class session" });
    }
    return res.status(201).json({
      message: "Class session created successfully",
      classSession: newClassSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while creating class session",
      error: error.message,
    });
  }
};

const getMyClassSessions = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const day = req.query.day || "MONDAY";
    const classSessions = await ClassSession.find({
      teacher: teacherId,
      day: day,
    }).populate([
      {
        path: "branch",
        select: "name",
      },
      {
        path: "subject",
        select: "name",
      },
    ]);

    return res.status(200).json({
      message: "Class sessions retrieved successfully",
      classSessions: classSessions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while retrieving class sessions",
      error: error.message,
    });
  }
};

const getClassSessionById = async (req, res) => {
  try {
    const { classSessionId } = req.params;
    if (!classSessionId) {
      return res.status(400).json({ message: "class session id is required" });
    }
    const classSession = await ClassSession.findById(classSessionId);
    if (!classSession) {
      return res.status(404).json({ message: "class session not found" });
    }
    return res.status(200).json({
      message: "class session fetched successfully",
      classSession: classSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching class session",
      error: error.message,
    });
  }
};

const getAllClassSession = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    if (page) {
      const limit = 6;
      const skip = (page - 1) * limit;

      const classSessions = await ClassSession.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate([
          { path: "branch", select: "name" },
          { path: "subject", select: "name" },
          { path: "teacher", select: "fullName" },
        ]);
      if (classSessions.length === 0) {
        return res.status(404).json({ message: "No class sessions found" });
      }
      return res.status(200).json({
        message: "Class sessions retrieved successfully",
        classSessions: classSessions,
        totalPages: Math.ceil((await ClassSession.countDocuments()) / limit),
        currentPage: page,
      });
    } else {
      const classSessions = await ClassSession.find()
        .sort({ createdAt: -1 })
        .populate([
          { path: "branch", select: "name" },
          { path: "subject", select: "name" },
          { path: "teacher", select: "fullName" },
        ]);
      return res.status(200).json({
        message: "Class sessions retrieved successfully",
        classSessions: classSessions,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while retrieving class sessions",
      error: error.message,
    });
  }
};

const updateClassSession = async (req, res) => {
  try {
    const { classSessionId } = req.params;
    const { subject, teacher, branch, timeSlot, day } = req.body;
    if (!classSessionId) {
      return res.status(400).json({ message: "class session id is required" });
    }
    const updatedClassSession = await ClassSession.findByIdAndUpdate(
      classSessionId,
      { subject, teacher, branch, timeSlot, day },
      { new: true },
    );
    if (!updatedClassSession) {
      return res.status(404).json({ message: "class session not found" });
    }
    return res.status(200).json({
      message: "class session updated successfully",
      classSession: updatedClassSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while updating class session",
      error: error.message,
    });
  }
};

const deleteClassSession = async (req, res) => {
  try {
    const { classSessionId } = req.params;
    if (!classSessionId) {
      return res.status(400).json({ message: "class session id is required" });
    }
    const deletedClassSession =
      await ClassSession.findByIdAndDelete(classSessionId);
    if (!deletedClassSession) {
      return res.status(404).json({ message: "class session not found" });
    }
    return res.status(200).json({
      message: "class session deleted successfully",
      classSession: deletedClassSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting class session",
      error: error.message,
    });
  }
};

const studentClassSession = async (req, res) => {
  try {
    const day = req.query.day || "MONDAY";

    const sessions = await ClassSession.find({
      day: day,
      branch: req.user.branch,
    })
      .populate({ path: "subject", select: "name" })
      .populate({ path: "teacher", select: "fullName email" })
      .populate({ path: "branch", select: "name" })
      .lean();

    return res.status(200).json({
      message: "class sessions retrieved successfully",
      classSessions: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while retrieving class sessions",
      error: error.message,
    });
  }
};

const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const day = req.query.day || "MONDAY";
    const classSessions = await ClassSession.find({
      teacher: teacherId,
      day: day,
    })
      .populate([
        {
          path: "branch",
          select: "name",
        },
        {
          path: "subject",
          select: "name",
        },
      ])
      .lean();

    const timeToMinutes = (time) => {
      let [hour, minute] = time.split(":").map(Number);

      // assumes afternoon for 1–7
      if (hour < 8) hour += 12;

      return hour * 60 + minute;
    };

    const getStatus = (timeSlot) => {
      const [start, end] = timeSlot.split("-");

      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);

      // --- IST CONVERSION START ---
      const now = new Date();

      // Get IST hours and minutes specifically using the India timezone
      const istTimeStr = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const istDate = new Date(istTimeStr);

      const nowMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      // --- IST CONVERSION END ---

      if (nowMinutes < startMinutes) return "Not started";
      if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
        return "Ongoing";
      }
      return "Completed";
    };

    const classesWithStatus = classSessions.map((cls) => ({
      ...cls,
      status: getStatus(cls.timeSlot),
    }));

    const sortedClasses = classesWithStatus.sort((a, b) => {
      const aStart = timeToMinutes(a.timeSlot.split("-")[0]);
      const bStart = timeToMinutes(b.timeSlot.split("-")[0]);
      return aStart - bStart;
    });

    return res.status(200).json({
      message: "Class sessions retrieved successfully",
      classesWithStatus: sortedClasses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while retrieving class sessions",
      error: error.message,
    });
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const day = req.query.day || "MONDAY";

    const sessions = await ClassSession.find({
      day: day,
      branch: req.user.branch,
    })
      .populate({ path: "subject", select: "name" })
      .populate({ path: "teacher", select: "fullName email" })
      .populate({ path: "branch", select: "name" })
      .lean();

    const timeToMinutes = (time) => {
      let [hour, minute] = time.split(":").map(Number);

      // assumes afternoon for 1–7 based on your timetable logic
      if (hour < 8) hour += 12;

      return hour * 60 + minute;
    };

    const getStatus = (timeSlot) => {
      const [start, end] = timeSlot.split("-");

      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);

      // --- IST CONVERSION START ---
      const now = new Date();

      // Forces the calculation to use India Standard Time numbers
      const istTimeStr = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const istDate = new Date(istTimeStr);

      const nowMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      // --- IST CONVERSION END ---

      if (nowMinutes < startMinutes) return "Not started";
      if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
        return "Ongoing";
      }
      return "Completed";
    };

    const classesWithStatus = sessions.map((cls) => ({
      ...cls,
      status: getStatus(cls.timeSlot),
    }));

    const sortedClasses = classesWithStatus.sort((a, b) => {
      const aStart = timeToMinutes(a.timeSlot.split("-")[0]);
      const bStart = timeToMinutes(b.timeSlot.split("-")[0]);
      return aStart - bStart;
    });

    return res.status(200).json({
      message: "class sessions retrieved successfully",
      classesWithStatus: sortedClasses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while retrieving class sessions",
      error: error.message,
    });
  }
};

export {
  createClassSession,
  getMyClassSessions,
  getClassSessionById,
  getAllClassSession,
  updateClassSession,
  deleteClassSession,
  studentClassSession,
  getTeacherDashboard,
  getStudentDashboard,
};
