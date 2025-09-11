const express = require('express');
const router = express.Router();
const assignTeacherController = require('./assignTeacherControllers');

// CRUD Routes for Subjects
router.get("/", assignTeacherController.getAllAssignedTeachers );
router.post("/", assignTeacherController.assignTeachers );
// router.put("/:id", subjectController.updateSubject);
// router.delete("/:id", subjectController.deleteSubject);

module.exports = router;