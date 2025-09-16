const mongoose = require("mongoose");
const { Schema } = mongoose;

const AttendanceSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: () => new Date(new Date().setHours(0, 0, 0, 0)) // normalize to start of day
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      required: true,
    },
    time: {
      type: String, 
    }
  },
  { timestamps: true }
);

// Index for fast queries: By class + section + date
AttendanceSchema.index({ class: 1, section: 1, date: 1 });
AttendanceSchema.index({ student: 1 });

const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;
