const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
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
  subjectGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectGroup",
      required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  timeFrom: {
    type: String, // "09:00"
    required: true,
  },
  timeTo: {
    type: String, // "09:45"
    required: true,
  },
  roomNo: {
    type: String,
  }
}, { timestamps: true });

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
