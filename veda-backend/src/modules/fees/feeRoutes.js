const express = require("express");
const {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  activateAcademicYear,
  getFeeCategories,
  createFeeCategory,
  updateFeeCategory,
  deleteFeeCategory,
  toggleFeeCategory,
} = require("./feeControllers");

const academicYearRouter = express.Router();

academicYearRouter.get("/", getAcademicYears);
academicYearRouter.post("/", createAcademicYear);
academicYearRouter.put("/:id", updateAcademicYear);
academicYearRouter.delete("/:id", deleteAcademicYear);
academicYearRouter.patch("/:id/activate", activateAcademicYear);

const feeCategoryRouter = express.Router();

feeCategoryRouter.get("/", getFeeCategories);
feeCategoryRouter.post("/", createFeeCategory);
feeCategoryRouter.put("/:id", updateFeeCategory);
feeCategoryRouter.delete("/:id", deleteFeeCategory);
feeCategoryRouter.patch("/:id/toggle", toggleFeeCategory);

module.exports = { academicYearRouter, feeCategoryRouter };
