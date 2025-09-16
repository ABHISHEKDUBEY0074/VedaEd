const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true, // e.g. "2025-26"
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // link to Class model
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section", // if classes are divided into sections
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  examType: {
    type: String,
    enum: ["Unit Test", "Midterm", "Final", "Practical", "Other"],
    // required: true,
  },
  title: {
    type: String,
    required: true, // e.g. "Unit Test 1 - Mathematics"
  },
  description: {
    type: String, // optional details about exam
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  passingMarks: {
    type: Number,
    default: 30,
  },
  date: {
    type: Date,
    required: true,
    // default:Date.now
  },
  startTime: {
    type: String, // e.g. "10:00 AM"
  },
  endTime: {
    type: String, // e.g. "12:00 PM"
  },
  room: {
    type: String, // exam room/hall allocation
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;