const express = require("express");
const router = express.Router();
const staffController = require("./staffControllers");
const { uploadSingle } = require("../../middleware/upload");
const authMiddleware = require("../../middleware/authMiddleware");
// Staff CRUD
router.post("/", authMiddleware, staffController.createStaff);         // Create staff member
router.get("/", authMiddleware, staffController.getAllStaff);          // Get all staff
router.get("/:id", authMiddleware, staffController.getStaffById);      // Get staff by ID
router.get("/:id/dashboard-stats", authMiddleware, staffController.getTeacherDashboardStats); // Teacher dashboard stats

router.put("/:id", authMiddleware, staffController.updateStaff);       // Update staff details
router.delete("/:id", authMiddleware, staffController.deleteStaff);// Delete staff

// Staff Attendance
router.post("/attendance/bulk", authMiddleware, staffController.markStaffAttendance);
router.get("/attendance/list", authMiddleware, staffController.getStaffAttendance);

// Staff Leave
router.get("/leave/requests", authMiddleware, staffController.getStaffLeaveRequests);
router.put("/leave/:id", authMiddleware, staffController.updateStaffLeaveStatus);

// Staff Payroll
router.get("/payroll/list", authMiddleware, staffController.getStaffPayroll);
router.put("/payroll/:id", authMiddleware, staffController.updateStaffPayroll);

// Staff Authentication
// router.post("/login", staffController.loginStaff);     // Staff login
// router.post("/logout", staffController.logoutStaff);   // Staff logout

// Salary Management
// router.get("/:id/salary", staffController.getSalaryDetails);   // Get salary info
// router.put("/:id/salary", staffController.updateSalaryDetails);// Update salary

// Profile Management
// router.put("/:id/profile", staffController.updateProfile);     // Update contact/image
// router.put("/:id/password", staffController.updatePassword);   // Change password

// Document Management
router.post("/upload", authMiddleware, uploadSingle("file"), staffController.uploadDocument);
router.get("/documents/:staffId", authMiddleware, staffController.getAllDocuments);
router.get("/preview/:filename", authMiddleware, staffController.previewDocument);
router.get("/download/:filename", authMiddleware, staffController.downloadDocument);
router.delete("/documents/:staffId/:documentId", authMiddleware, staffController.deleteDocument);

module.exports = router;
