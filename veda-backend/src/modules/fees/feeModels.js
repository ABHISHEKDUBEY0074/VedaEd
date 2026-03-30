const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
  name: String,
  startDate: String,
  endDate: String,
  dueDate: String,
});

const academicYearSchema = new mongoose.Schema({
  label: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  terms: [termSchema],
}, { timestamps: true });

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

const feeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  desc: String,
  frequency: String,
  applicability: String,
  optional: { type: Boolean, default: false },
  partial: { type: Boolean, default: false },
  taxable: { type: Boolean, default: false },
  taxPercent: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const FeeCategory = mongoose.model("FeeCategory", feeCategorySchema);

module.exports = { AcademicYear, FeeCategory };
