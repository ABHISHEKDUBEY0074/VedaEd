const express = require('express');
const router = express.Router();
const timeTableControllers = require("./timeTableControllers");
console.log("timetable routing works ");
router.post("/", timeTableControllers.createTimetableEntry );
// router.get("/", classTimetable);


module.exports = router;