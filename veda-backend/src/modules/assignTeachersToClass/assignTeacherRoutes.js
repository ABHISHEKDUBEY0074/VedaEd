const express = require('express');
const router = express.Router();
const assignTeacherController = require('./assignTeacherControllers');

// CRUD Routes for Subjects
router.get("/", assignTeacherController.getAllAssignedTeachers );
router.post("/", assignTeacherController.assignTeachers );
router.put("/:id", assignTeacherController.updateAssignTeacher);
router.delete("/:id", assignTeacherController.deleteAssignTeachers);

module.exports = router;