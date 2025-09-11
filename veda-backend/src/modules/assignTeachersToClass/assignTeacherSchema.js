const mongoose = require("mongoose");

const assignTeacherSchema = new mongoose.Schema(
  {
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
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff", // since teacher comes from Staff schema
        required: true,
      },
    ],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // must be one of the teachers above
      required: true,
    },
  },
  { timestamps: true }
);

const AssignTeacher = mongoose.model("AssignTeacher", assignTeacherSchema);
module.exports = AssignTeacher;
