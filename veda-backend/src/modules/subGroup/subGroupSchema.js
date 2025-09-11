const mongoose = require("mongoose");

const subGroupSchema = new mongoose.Schema(
  {
    name: { // e.g., "Class 2 Subject Group"
      type: String,
      required: true,
    },
    classes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // subject belongs to a specific class
      required:true
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    // teachers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Teacher", // teachers assigned to subject
    //   },
    // ],
  },
  { timestamps: true }
);

const SubjectGroup = mongoose.model("SubjectGroup", subGroupSchema);
module.exports = SubjectGroup;


// I am trying to assign subjects to class under a subGroup schema, i have separate schema for class which has subjects as array of objects of type ObjectId, and i also  will give u my class schema and subject 