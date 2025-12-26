const express = require("express");
const router = express.Router();
const examTimetableController = require("./examTimetableController");
const upload = require("../../middleware/upload"); // Reuse existing upload middleware

// Routes
router.post("/upload", upload.single("file"), examTimetableController.uploadExamTimetable);
router.get("/", examTimetableController.getExamTimetables);
router.delete("/:id", examTimetableController.deleteExamTimetable);

module.exports = router;
