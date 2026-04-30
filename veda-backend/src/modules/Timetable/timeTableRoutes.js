const express = require('express');
const router = express.Router();
const timeTableControllers = require("./timeTableControllers");
const authMiddleware = require("../../middleware/authMiddleware");

console.log("timetable routing works ");
router.post("/", timeTableControllers.createTimetableEntry );
router.get("/", authMiddleware, timeTableControllers.getTimetableEntries );
router.get("/debug", timeTableControllers.debugTimetableData );
router.put("/:id", timeTableControllers.updateTimetableEntry);
router.delete("/:id", timeTableControllers.deleteTimetableEntry );

module.exports = router;