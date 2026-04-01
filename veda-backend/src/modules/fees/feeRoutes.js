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
  getGradeFees,
  updateGradeFee,
  getInstallmentPlans,
  createInstallmentPlan,
  updateInstallmentPlan,
  deleteInstallmentPlan
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

const gradeFeeRouter = express.Router();
gradeFeeRouter.get("/", getGradeFees);
gradeFeeRouter.patch("/update", updateGradeFee);

const installmentPlanRouter = express.Router();
installmentPlanRouter.get("/", getInstallmentPlans);
installmentPlanRouter.post("/", createInstallmentPlan);
installmentPlanRouter.put("/:id", updateInstallmentPlan);
installmentPlanRouter.delete("/:id", deleteInstallmentPlan);

module.exports = { 
  academicYearRouter, 
  feeCategoryRouter, 
  gradeFeeRouter, 
  installmentPlanRouter 
};
