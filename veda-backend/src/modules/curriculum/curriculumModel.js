const mongoose = require("mongoose");
const { Schema } = mongoose;

const CurriculumSchema = new Schema({
  academicYear: {
    type: String, // e.g., "2025-2026"
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "Class"
  },
  section: {
    type: String, // e.g., "A", "B", "C"
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"

    //   assessment: {
    //     periodicTests: { type: Number }, // e.g., 20 marks
    //     halfYearly: { type: Number }, // e.g., 30 marks
    //     finalExam: { type: Number }, // e.g., 50 marks
    //     projectWork: { type: Number }, // optional
    //   },
    },
  ],
  electives: [
    {
      electiveName: { type: String }, // e.g., "Art", "Music", "Computer Applications"
      syllabus: [{ type: String }], // optional
    },
  ],
  coCurricular: [
    {
      activityName: { type: String }, // e.g., "Sports", "Drama Club"
      description: { type: String },
    },
  ],
}, {timestamps:true});

const Curriculum = mongoose.model("Curriculum", CurriculumSchema);
module.exports = Curriculum;