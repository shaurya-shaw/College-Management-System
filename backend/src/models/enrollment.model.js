import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classSession: {
      type: Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ user: 1, classSession: 1 }, { unique: true }); //This exact pair is allowed only once.

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
