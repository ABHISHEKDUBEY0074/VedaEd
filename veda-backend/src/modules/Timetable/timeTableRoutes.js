const express = require('express');
const router = express.Router();
const timeTableControllers = require("./timeTableControllers");
console.log("timetable routing works ");
router.post("/", timeTableControllers.createTimetableEntry );
router.get("/", timeTableControllers.getTimetableEntries );
router.get("/debug", timeTableControllers.debugTimetableData );
router.delete("/:id", timeTableControllers.deleteTimetableEntry );

module.exports = router;