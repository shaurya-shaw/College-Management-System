import mongoose, { Schema } from "mongoose";

const classSessionSchema = new Schema(
  {
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THRUSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
      required: true,
    },
    timeSlot: {
      type: String,
      enum: [
        "9:15-10:05",
        "10:10-11:00",
        "11:05-11:55",
        "12:00-12:50",
        "1:50-2:40",
        "2:45-3:35",
        "3:40-4:30",
        "4:35-5:25",
      ],
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true },
);

classSessionSchema.index({ branch: 1, day: 1, timeSlot: 1 }, { unique: true });

export const ClassSession = mongoose.model("ClassSession", classSessionSchema);
