const express = require("express");
const router = express.Router();
const staffController = require("./staffControllers");
const upload = require("../../middleware/upload");
// Staff CRUD
router.post("/", staffController.createStaff);         // Create staff member
router.get("/", staffController.getAllStaff);          // Get all staff
router.get("/:id", staffController.getStaffById);      // Get staff by ID
router.get("/:id/dashboard-stats", staffController.getTeacherDashboardStats); // Teacher dashboard stats

router.put("/:id", staffController.updateStaff);       // Update staff details
router.delete("/:id", staffController.deleteStaff);// Delete staff

// Staff Attendance
router.post("/attendance/bulk", staffController.markStaffAttendance);
router.get("/attendance/list", staffController.getStaffAttendance);

// Staff Leave
router.get("/leave/requests", staffController.getStaffLeaveRequests);
router.put("/leave/:id", staffController.updateStaffLeaveStatus);

// Staff Payroll
router.get("/payroll/list", staffController.getStaffPayroll);
router.put("/payroll/:id", staffController.updateStaffPayroll);

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
router.post("/upload", upload.single("file"), staffController.uploadDocument);
router.get("/documents/:staffId", staffController.getAllDocuments);
router.get("/preview/:filename", staffController.previewDocument);
router.get("/download/:filename", staffController.downloadDocument);

module.exports = router;
