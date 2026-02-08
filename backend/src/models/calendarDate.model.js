import mongoose, { Schema } from "mongoose";

const calendarDateSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    isHoliday: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

export const CalendarDate = mongoose.model("CalendarDate", calendarDateSchema);
