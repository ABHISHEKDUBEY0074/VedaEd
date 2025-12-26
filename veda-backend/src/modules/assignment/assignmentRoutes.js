const express = require("express");
const router = express.Router();
const assignmentControllers = require("./assignmentController.js");
const upload = require("../../middleware/upload");
const { teacherOnly } = require("../../middleware/auth");

// Teacher routes
router.post("/", upload.single("document"), assignmentControllers.createAssignment);
router.get("/", assignmentControllers.getAssignments);
router.get("/:id", assignmentControllers.getAssignmentById);
router.put("/:id", teacherOnly, assignmentControllers.updateAssignment);
router.delete("/:id", assignmentControllers.deleteAssignment);

// Student routes
// Student routes


// router.get("/student/list", protect, studentOnly, getStudentAssignments);
// router.post("/:id/submit", protect, studentOnly, upload.single("file"), submitAssignment);

module.exports = router;
