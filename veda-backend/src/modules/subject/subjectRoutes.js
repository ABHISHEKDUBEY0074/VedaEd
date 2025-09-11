const express = require('express');
const router = express.Router();
const subjectController = require('./subjectController');
// console.log("subj route loaded" || subjectController);

// CRUD Routes for Subjects
router.get("/", subjectController.getSubjects);
// router.get("/:id", subjectController.getSubjectById);
router.post("/", subjectController.createSubject);
// router.put("/:id", subjectController.updateSubject);
// router.delete("/:id", subjectController.deleteSubject);

module.exports = router;