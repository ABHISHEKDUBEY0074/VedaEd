const express = require('express');
const router = express.Router();
const subGroupController = require('./subGroupController');


// CRUD Routes for Subjects
router.get("/", subGroupController.getAllSubjectGroups);
router.post("/", subGroupController.createSubjectGroup);
// router.put("/:id", subjectController.updateSubject);
// router.delete("/:id", subjectController.deleteSubject);

module.exports = router;