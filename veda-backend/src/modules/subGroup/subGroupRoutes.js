const express = require('express');
const router = express.Router();
const subGroupController = require('./subGroupController');


// CRUD Routes for Subjects
router.get("/", subGroupController.getAllSubjectGroups);
router.post("/", subGroupController.createSubjectGroup);
router.put("/:id", subGroupController.updateSubjectGroup);
router.delete("/:id", subGroupController.deleteSubjectGroup);

module.exports = router;