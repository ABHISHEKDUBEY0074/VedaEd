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

const gradeFeeSchema = new mongoose.Schema({
  year: { type: String, required: true },
  grade: { type: String, required: true },
  tuition: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  lab: { type: Number, default: 0 },
  library: { type: Number, default: 0 },
  sports: { type: Number, default: 0 },
  exam: { type: Number, default: 0 },
  development: { type: Number, default: 0 },
}, { timestamps: true });

const GradeFee = mongoose.model("GradeFee", gradeFeeSchema);

const sliceSchema = new mongoose.Schema({
  label: String,
  days: { type: Number, default: 0 },
  percent: { type: Number, default: 0 }
});

const installmentPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: String, required: true },
  slices: [sliceSchema]
}, { timestamps: true });

const InstallmentPlan = mongoose.model("InstallmentPlan", installmentPlanSchema);

module.exports = { AcademicYear, FeeCategory, GradeFee, InstallmentPlan };
