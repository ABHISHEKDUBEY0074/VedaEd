const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  subjects: [
    {
      subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
      marksObtained: { type: Number, required: true },
      maxMarks: { type: Number, required: true },
      grade: { type: String },
      remarks: { type: String }
    }
  ],
  totalMarksObtained: {
    type: Number,
    default: 0
  },
  totalMaxMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  resultStatus: {
    type: String,
    enum: ["Pass", "Fail", "Pending"],
    default: "Pending"
  },
  overallRemarks: {
    type: String
  }
}, { timestamps: true });

const Report= mongoose.model("Report", reportSchema);
module.exports = Report;