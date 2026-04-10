// student.routes.js
const express = require("express");
const router = express.Router();
const studentController = require("./studentControllers");
const { uploadSingle } = require("../../middleware/upload");
const authMiddleware = require("../../middleware/authMiddleware");
const permissionMiddleware = require("../../middleware/permissionMiddleware");

// Student CRUD (Admin / Staff roles mostly)
router.post("/", authMiddleware, permissionMiddleware("create_student"), studentController.createStudent);         // Create new student
router.get("/", authMiddleware, permissionMiddleware("view_student"), studentController.getAllStudents);         // Get all students
router.get("/stats", authMiddleware, permissionMiddleware("view_student"), studentController.getStudentStats);  // Get student statistics
router.get("/next-id", authMiddleware, permissionMiddleware("create_student"), studentController.getNextStudentId); // Preview next auto Student ID
router.get("/:id", authMiddleware, permissionMiddleware("view_student"), studentController.getStudent);      // Get one student(PROFILE)
router.get("/:id/dashboard-stats", authMiddleware, permissionMiddleware("view_student"), studentController.getStudentDashboardStats);  // Get student dashboard stats

router.put("/:id", authMiddleware, permissionMiddleware("edit_student"), studentController.updateStudent);       // Update student info (profile)
router.delete("/:id", authMiddleware, permissionMiddleware("delete_student"), studentController.deleteStudentById);    // Remove student
router.post("/import", authMiddleware, permissionMiddleware("create_student"), studentController.importStudents);


router.post("/upload", authMiddleware, permissionMiddleware("edit_student"), uploadSingle("file"), studentController.uploadDocument);
// all docs of a student
router.get("/documents/:studentId", authMiddleware, permissionMiddleware("view_student"), studentController.getAllDocuments);
// Preview
router.get("/preview/:filename", authMiddleware, permissionMiddleware("view_student"), studentController.previewDocument);
// Download
router.get("/download/:filename", authMiddleware, permissionMiddleware("view_student"), studentController.downloadDocument);
router.delete("/documents/:studentId/:documentId", authMiddleware, permissionMiddleware("edit_student"), studentController.deleteDocument);

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
