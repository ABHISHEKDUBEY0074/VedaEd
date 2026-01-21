const express = require("express");
const router = express.Router();
const controller = require("./interviewController");

router.get("/", controller.getInterviewCandidates);
router.post("/schedule", controller.scheduleInterview);
router.put("/:id", controller.updateInterviewResult);
router.post("/result", controller.declareResult);

module.exports = router;
