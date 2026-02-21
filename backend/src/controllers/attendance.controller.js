import { Attendance } from "../models/attendance.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { CalendarDate } from "../models/calendarDate.model.js";
import mongoose from "mongoose";

const getStudentsAtendanceSheet = async (req, res) => {
  try {
    const { classSessionId } = req.params;

    if (!classSessionId) {
      return res.status(400).json({ message: "class session id is required" });
    }

    const today = new Date().toISOString().split("T")[0];

    const day = await CalendarDate.findOne({ date: today });

    if (day.isHoliday) {
      return res.status(400).json({ message: "today is a holiday" });
    }

    const enrollments = await Enrollment.find({
      classSession: classSessionId,
    }).populate({ path: "user", select: "fullName email" });

    if (!enrollments) {
      return res.status(404).json({ message: "no enrollments found" });
    }

    const existingStudents = await Attendance.find({
      classSession: classSessionId,
      calendarDate: today,
    });

    const sheet = enrollments.map((enroll) => {
      const records = existingStudents.find(
        (rec) => rec.user.toString() === enroll.user._id.toString(),
      );

      return {
        studentId: enroll.user._id,
        name: enroll.user.fullName,
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
    const { classSessionId, studentId, calendarDateId, isPresent } = req.body;

    if (!classSessionId) {
      return res.status(400).json({
        message: "class session id is required",
      });
    }

    await Attendance.updateOne(
      {
        user: studentId,
        classSession: classSessionId,
        calendarDate: calendarDateId,
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
      .populate({ path: "calendarDate", select: "date" });
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

export {
  getStudentsAtendanceSheet,
  markAttendance,
  myAttendance,
  attendanceSummary,
};
