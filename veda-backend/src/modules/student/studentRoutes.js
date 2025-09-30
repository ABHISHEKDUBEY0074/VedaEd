// student.routes.js
const express = require("express");
const router = express.Router();
const studentController = require("./studentControllers");
const upload = require("../../middleware/upload");

// Student CRUD (Admin / Staff roles mostly)
router.post("/", studentController.createStudent);         // Create new student
router.get("/", studentController.getAllStudents);         // Get all students
router.get("/stats", studentController.getStudentStats);  // Get student statistics
router.get("/:id", studentController.getStudent);      // Get one student(PROFILE)
router.put("/:id", studentController.updateStudent);       // Update student info (profile)
router.delete("/:id", studentController.deleteStudentById);    // Remove student
router.post("/import", studentController.importStudents);


router.post("/upload", upload.single("file"), studentController.uploadDocument);
// all docs of a student
router.get("/:studentId", studentController.getAllDocuments);
// Preview
router.get("/preview/:filename", studentController.previewDocument);
// Download
router.get("/download/:filename", studentController.downloadDocument);

// Student Authentication
// router.post("/login", studentController.loginStudent);     // Student login
// router.post("/logout", studentController.logoutStudent);   // Logout

// Curriculum & Academics
// router.get("/:id/curriculum", studentController.getCurriculum);   // Get assigned curriculum
// router.get("/:id/assignments", studentController.getAssignments); // Get all assignments
// router.get("/:id/exams", studentController.getExams);             // Get exam schedule
// router.get("/:id/reports", studentController.getReports);         // Get report card

// Parent Info
// router.get("/:id/parent", studentController.getParentInfo);
// router.put("/:id/parent", studentController.updateParentInfo);

// Profile
// router.put("/:id/profile", studentController.updateProfile);      // Update contact, image etc.
// router.put("/:id/password", studentController.updatePassword);    // Change password

module.exports = router;
