import { Branch } from "../models/branch.model.js";

const createBranch = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "branch name is required" });
    }
    const existingBranch = await Branch.findOne({ name: name.trim() });
    if (existingBranch) {
      return res.status(400).json({ message: "branch name already exists" });
    }
    const branch = await Branch.create({ name: name.trim() });
    return res.status(201).json({
      message: "branch created successfully",
      branch: branch,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while creating branch",
      error: error.message,
    });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    if (branches.length === 0) {
      return res.status(404).json({ message: "no branches found" });
    }
    return res.status(200).json({
      message: "branches fetched successfully",
      branches: branches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching branches",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "branch id is required" });
    }
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ message: "branch not found" });
    }
    return res.status(200).json({
      message: "branch fetched successfully",
      branch: branch,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching branch",
      error: error.message,
    });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "branch id is required" });
    }
    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).json({ message: "branch not found" });
    }
    return res.status(200).json({
      message: "branch deleted successfully",
      branch: branch,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting branch",
      error: error.message,
    });
  }
};

export { createBranch, getAllBranches, getBranchById, deleteBranch };
