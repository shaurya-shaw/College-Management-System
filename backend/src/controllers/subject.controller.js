import { Branch } from "../models/branch.model.js";
import { ClassSession } from "../models/classSession.model.js";
import { Subject } from "../models/subject.model.js";

const addSubject = async (req, res) => {
  try {
    const { name, branch } = req.body;
    if (!name || !branch) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const bran = await Branch.findOne({ name: branch });
    if (!bran) {
      return res.status(404).json({ message: "branch not found" });
    }

    const subject = await Subject.create({
      name,
      branch: bran._id,
    });

    if (!subject) {
      return res.status(500).json({ message: "subject creation failed" });
    }
    return res
      .status(201)
      .json({ message: "subject created successfully", subject: subject });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while creating subject",
      error: error.message,
    });
  }
};

const getMySubjects = async (req, res) => {
  const subjects = await Subject.find({ branch: req.user.branch });
  if (subjects.length == 0) {
    return res.status(404).json({ message: "subjects not found" });
  }
  return res
    .status(200)
    .json({ message: "subjects fetched successfully", subjects: subjects });
};

const updateSubject = async (req, res) => {
  try {
    const { name, branch } = req.body;
    if (!name || !branch) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const subject = await Subject.findByIdAndUpdate(
      req.params.subjectId,
      {
        $set: {
          name,
          branch,
        },
      },
      { new: true },
    );
    if (!subject) {
      return res
        .status(500)
        .json({ message: "something went wrong while updating subject" });
    }
    return res
      .status(200)
      .json({ message: "subject updated successfully", subject: subject });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while updating subject",
      error: error.message,
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "subject deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting subject",
      error: error.message,
    });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate({
      path: "branch",
      select: "name",
    });
    if (subjects.length == 0) {
      return res.status(404).json({ message: "subjects not found" });
    }
    return res
      .status(200)
      .json({ message: "subjects fetched successfully", subjects: subjects });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching subjects",
      error: error.message,
    });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate({
      path: "branch",
      select: "name",
    });
    if (!subject) {
      return res.status(404).json({ message: "subject not found" });
    }
    return res
      .status(200)
      .json({ message: "subject fetched successfully", subject: subject });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching subject",
      error: error.message,
    });
  }
};

const getTeacherSubjects = async (req, res) => {
  try {
    const subjectIds = await ClassSession.distinct("subject", {
      teacher: req.user._id,
    });
    const subjects = await Subject.find({ _id: { $in: subjectIds } }).populate({
      path: "branch",
      select: "name",
    });
    if (subjects.length == 0) {
      return res.status(404).json({ message: "subjects not found" });
    }
    return res
      .status(200)
      .json({ message: "subjects fetched successfully", subjects: subjects });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching subjects",
      error: error.message,
    });
  }
};

export {
  addSubject,
  getMySubjects,
  updateSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectById,
  getTeacherSubjects,
};
