const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  fileUrl: String,             // uploaded file path
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Submitted", "Pending"], default: "Pending" },
  marksObtained: Number,
  grade: String,
  feedback: String
},
{ timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;