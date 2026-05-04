const express = require("express");
const router = express.Router();
const examTimetableController = require("./examTimetableController");
const { upload } = require("../../middleware/upload"); // Reuse existing upload middleware
const authMiddleware = require("../../middleware/authMiddleware");

// Routes
router.post("/upload", authMiddleware, upload.single("file"), examTimetableController.uploadExamTimetable);
router.put("/:id", authMiddleware, upload.single("file"), examTimetableController.updateExamTimetable);
router.get("/", authMiddleware, examTimetableController.getExamTimetables);
router.delete("/:id", authMiddleware, examTimetableController.deleteExamTimetable);

module.exports = router;
