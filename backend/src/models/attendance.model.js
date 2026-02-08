import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    calendarDate: {
      type: Schema.Types.ObjectId,
      ref: "CalendarDate",
      required: true,
    },
    classSession: {
      type: Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index(
  { user: 1, calendarDate: 1, classSession: 1 },
  { unique: true },
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
