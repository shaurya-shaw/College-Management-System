import { ClassSession } from "../models/classSession.model.js";

const createClassSession = async (req, res) => {
  try {
    const { subject, teacher, branch, timeSlot, day } = req.body;
    if (!subject || !teacher || !branch || !timeSlot || !day) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newClassSession = await ClassSession.create({
      subject,
      teacher,
      branch,
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
    const classSessions = await ClassSession.find({ teacher: teacherId });

    if (classSessions.length === 0) {
      return res.status(404).json({ message: "No class sessions found" });
    }
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
    const classSessions = await ClassSession.find();
    if (classSessions.length === 0) {
      return res.status(404).json({ message: "No class sessions found" });
    }
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

export {
  createClassSession,
  getMyClassSessions,
  getClassSessionById,
  getAllClassSession,
  updateClassSession,
  deleteClassSession,
};
