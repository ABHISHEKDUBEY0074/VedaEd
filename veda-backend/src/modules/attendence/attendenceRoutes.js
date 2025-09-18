const express = require("express");
const router = express.Router();
const attendanceControllers = require("./attendenceController");

// Statistics
router.get("/weekly", attendanceControllers.getWeeklyStats); // Get weekly attendance statistics

// By Class
router.post("/class", attendanceControllers.markClassAttendance); // bulk mark for class
router.get("/class/:classId/:sectionId/:date", attendanceControllers.getAttendanceByClass); // Get attendance by class & section (for a date)
// By Student
router.put("/student/:studentId", attendanceControllers.updateAttendanceByStudent); // for mark/update
router.get("/student/:studentId", attendanceControllers.getAttendanceByStudent); // history of one student ...?ask abhishek...isko abhi implement krna hai ?

module.exports = router;
