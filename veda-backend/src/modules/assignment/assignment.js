const mongoose = require("mongoose");
const { Schema } = mongoose;

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // or directly Curriculum subject
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Class",
    required: true
  },
//   assignedTo: [
//     {
//       student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//       status: {
//         type: String,
//         enum: ["Assigned", "Submitted", "Graded"],
//         default: "Assigned",
//       },
//     },
//   ],
  dueDate: {
    type: Date,
    // required: true, // ? should we do it required 
  },
  maxMarks: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;

/*
{
  "title": "Algebra Worksheet 1",
  "description": "Solve the given 10 problems on linear equations.",
  "subject": "66c4774e39eab24341a1a9c2",  // Maths
  "teacher": "66c4789d81da321f2c997d44",  // Mr. Sharma
  "assignedTo": [
    {
      "student": "66c479aa1adbe218d30b9af3",
      "status": "Submitted",
      "submission": {
        "fileUrl": "https://school-app/uploads/student1/algebra1.pdf",
        "submittedAt": "2025-08-20T10:00:00Z",
        "grade": "A",
        "feedback": "Good work, but revise Q7."
      }
    },
    {
      "student": "66c47aab2dddf233e12b9b01",
      "status": "Assigned"
    }
  ],
  "dueDate": "2025-08-25T00:00:00Z",
  "maxMarks": 20,
  "createdAt": "2025-08-18T12:00:00Z"
}
 */
