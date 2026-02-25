const express = require("express");
const router = express.Router();
const gradebookController = require("./gradebookController");

router.post("/save", gradebookController.saveMarks);
router.get("/marks", gradebookController.getMarks);
router.get("/students", gradebookController.getStudentsForGradebook);

module.exports = router;
