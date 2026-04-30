const express = require('express');
const router = express.Router();
const subjectController = require('./subjectController');
const authMiddleware = require('../../middleware/authMiddleware');

// CRUD Routes for Subjects
router.get("/", authMiddleware, subjectController.getSubjects);
// router.get("/:id", subjectController.getSubjectById);
router.post("/", authMiddleware, subjectController.createSubject);
router.put("/:id", authMiddleware, subjectController.updateSubject);
router.delete("/:id", authMiddleware, subjectController.deleteSubject);

module.exports = router;