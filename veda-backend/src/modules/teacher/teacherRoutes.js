const express = require('express');
const router = express.Router();
const teacherController = require('./teacherController');

router.get('/', teacherController.getteachers );
router.get('/:id', teacherController.getteacherById );
router.post("/", teacherController.createTeacher);
router.put("/:id", teacherController.updateTeacher);
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;