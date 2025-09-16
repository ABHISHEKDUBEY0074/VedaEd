const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: { 
    type: String, 
    unique: true, 
  },
  subjectName: { 
    type: String, 
    required: true // e.g., "Mathematics"
  },
  // teachers: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Teacher", // teachers assigned to subject
  //   }
  // ],
  type: {
  type: String,
  enum: ["Theory", "Practical"],
  default: "Theory",
  required: true
},
}, { timestamps: true });

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
