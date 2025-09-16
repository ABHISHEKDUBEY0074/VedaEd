const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "10th Grade"
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section", // Each class can have multiple sections (A, B, C)
        required: true,
      },
    ],
    capacity:{
      type:String,
    },
    // classTeacher: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Teacher",
    // },
    // students: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Student",
    //   },
    // ],
    // subjects: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Subject", // Subjects assigned to this class
    //   },
    // ],
    // strength: {
    //   type: Number,
    //   default: 0, // number of students enrolled in this class
    // },
    // classFees: {
    //   type: Number,
    // },
    // schedule: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Schedule",
    // },
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
