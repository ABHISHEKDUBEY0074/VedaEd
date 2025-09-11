const express = require("express");
const router = express.Router();
const sectionController = require('./sectionController');

router.post('/', sectionController.createSection);
router.get('/', sectionController.getAllSections);
router.get("/search", sectionController.getSections);
module.exports = router;