import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Branch = mongoose.model("Branch", branchSchema);
