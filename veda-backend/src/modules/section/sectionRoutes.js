const express = require("express");
const router = express.Router();
const sectionController = require('./sectionController');

router.post('/', sectionController.createSection);
router.get('/', sectionController.getSections); // Changed from getAllSections to getSections
// router.get("/search", sectionController.getSections);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;