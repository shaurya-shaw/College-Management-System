import { Attendance } from "../models/attendance.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { CalendarDate } from "../models/calendarDate.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { calculateDistance } from "../lib/distance.js";
import { ClassSession } from "../models/classSession.model.js";
import { User } from "../models/user.model.js";

const getStudentsAtendanceSheet = async (req, res) => {
  try {
    const { classSessionId } = req.params;

    if (!classSessionId) {
      return res.status(400).json({ message: "class session id is required" });
    }

    const today = new Date("2026-03-27"); // for testing

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const day = await CalendarDate.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log(day);

    console.log(day.isHoliday);

    if (day.isHoliday) {
      return res.status(400).json({ message: "today is a holiday" });
    }

    const classes = await ClassSession.findById(classSessionId);

    if (!classes) {
      return res.status(404).json({ message: "class session not found" });
    }

    const enrollments = await User.find({
      branch: classes.branch,
    });

    if (!enrollments) {
      return res.status(404).json({ message: "no enrollments found" });
    }

    const existingStudents = await Attendance.find({
      classSession: classSessionId,
      calendarDate: day._id,
    });

    const sheet = enrollments.map((enroll) => {
      const records = existingStudents.find(
        (rec) => rec.user.toString() === enroll._id.toString(),
      );

      return {
        studentId: enroll._id,
        email: enroll.email,
        fullName: enroll.fullName,
        isPresent: records ? records.isPresent : false,
      };
    });

    return res.status(200).json({
      message: "sheet fetched successfully",
      sheet: sheet,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching attendance sheet",
      error: error.message,
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { classSessionId } = req.params;
    const { studentId, date, isPresent } = req.body;

    if (!classSessionId) {
      return res.status(400).json({
        message: "class session id is required",
      });
    }

    if (!studentId) {
      return res.status(400).json({
        message: "student id is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "date is required",
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const calendarDate = await CalendarDate.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!calendarDate) {
      return res.status(400).json({
        message: "date not found",
      });
    }

    const day = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const realDay = await ClassSession.findById(classSessionId)
      .select("day")
      .lean();
    console.log(realDay.day);
    console.log(day);

    if (day !== realDay.day) {
      return res.status(400).json({
        message: "Attendance cannot be marked after 24 hours",
      });
    }

    await Attendance.updateOne(
      {
        user: studentId,
        classSession: classSessionId,
        calendarDate: calendarDate._id,
      },
      {
        $set: { isPresent: isPresent },
      },
      { upsert: true }, //create if not exist
    );

    return res.status(200).json({
      message: "attendance marked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while marking attendance",
      error: error.message,
    });
  }
};

const myAttendance = async (req, res) => {
  try {
    const allAttendance = await Attendance.find({
      user: req.user._id,
    })
      .populate({
        path: "classSession",
        select: "timeSlot day",
        populate: [{ path: "subject", select: "name" }],
      })
      .populate({ path: "calendarDate", select: "date" })
      .sort({ createdAt: -1 })
      .lean();
    if (allAttendance.length == 0) {
      return res.status(404).json({ message: "no attendance records found" });
    }
    return res.status(200).json({
      message: "attendance records fetched successfully",
      attendance: allAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching attendance records",
      error: error.message,
    });
  }
};

const attendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = new mongoose.Types.ObjectId(studentId);

    const summary = await Attendance.aggregate([
      {
        $match: { user: userId },
      },
      {
        $lookup: {
          from: "classSessions",
          localField: "classSession",
          foreignField: "_id",
          as: "classSession",
        },
      },
      { $unwind: "$classSession" },
      {
        $lookup: {
          from: "subjects",
          localField: "classSession.subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: "$subject._id",
          subjectName: { $first: "$subject.name" },
          totalClasses: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$isPresent", true] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$subjectName",
          totalClasses: 1,
          present: 1,
          percentage: {
            $multiply: [{ $divide: ["$present", "$totalClasses"] }, 100],
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "attendance summary fetched successfully",
      summary: summary,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching attendance summary",
      error: error.message,
    });
  }
};

const generateAttendanceQrCode = async (req, res) => {
  try {
    const { classSessionId, date } = req.params;

    if (!classSessionId || !date) {
      return res
        .status(400)
        .json({ message: "class session id and calendar date  is required" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const calendarDate = await CalendarDate.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!calendarDate) {
      return res.status(400).json({
        message: "date not found",
      });
    }

    const day = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const realDay = await ClassSession.findById(classSessionId)
      .select("day")
      .lean();
    console.log(realDay.day);
    console.log(day);

    if (day !== realDay.day) {
      return res.status(400).json({
        message: "Attendance cannot be marked after 24 hours",
      });
    }

    const token = jwt.sign(
      {
        classSessionId: classSessionId,
        calendarDateId: calendarDate._id,
      },
      process.env.QRGENERATOR_SECRET,
      { expiresIn: "5m" },
    );
    return res.status(200).json({
      message: "QR code generated successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while generating QR code",
      error: error.message,
    });
  }
};

const scanAttendanceQrCode = async (req, res) => {
  try {
    const { token, latitude, longitude } = req.body;
    if (!token) {
      return res.status(400).json({ message: "QR code token is required" });
    }
    const decodedToken = jwt.verify(token, process.env.QRGENERATOR_SECRET);

    const building_latitude = parseFloat(process.env.BUILDING_LATITUDE);
    const building_longitude = parseFloat(process.env.BUILDING_LONGITUDE);

    const distance = calculateDistance(
      building_latitude,
      building_longitude,
      latitude,
      longitude,
    );

    if (distance > parseFloat(process.env.PERMITTED_RADIUS)) {
      return res.status(403).json({
        message: "You are outside building range",
      });
    }

    const existingRecord = await Attendance.findOne({
      user: req.user._id,
      classSession: decodedToken.classSessionId,
      calendarDate: decodedToken.calendarDateId,
    });
    if (existingRecord) {
      return res.status(400).json({
        message: "attendance already marked for today",
      });
    }
    await Attendance.create({
      user: req.user._id,
      classSession: decodedToken.classSessionId,
      calendarDate: decodedToken.calendarDateId,
      isPresent: true,
    });

    return res.status(200).json({
      message: "attendance marked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while scanning QR code",
      error: error.message,
    });
  }
};

export {
  getStudentsAtendanceSheet,
  markAttendance,
  myAttendance,
  attendanceSummary,
  generateAttendanceQrCode,
  scanAttendanceQrCode,
};
