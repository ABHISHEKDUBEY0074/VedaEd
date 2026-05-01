const express = require("express");
const router = express.Router();
const assignmentControllers = require("./assignmentController.js");
const { upload } = require("../../middleware/upload");
const { teacherOnly } = require("../../middleware/auth");
const authMiddleware = require("../../middleware/authMiddleware");

// Teacher routes
router.post("/", authMiddleware, upload.single("document"), assignmentControllers.createAssignment);
router.get("/", authMiddleware, assignmentControllers.getAssignments);
router.get("/:id", authMiddleware, assignmentControllers.getAssignmentById);
router.put("/:id", authMiddleware, teacherOnly, upload.single("document"), assignmentControllers.updateAssignment);
router.delete("/:id", authMiddleware, assignmentControllers.deleteAssignment);

// Student routes
// Student routes


// router.get("/student/list", protect, studentOnly, getStudentAssignments);
// router.post("/:id/submit", protect, studentOnly, upload.single("file"), submitAssignment);

module.exports = router;
