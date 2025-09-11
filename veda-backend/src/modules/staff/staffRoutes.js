const express = require("express");
const router = express.Router();
const staffController = require("./staffControllers");
// Staff CRUD
router.post("/", staffController.createStaff);         // Create staff member
router.get("/", staffController.getAllStaff);          // Get all staff
// router.get("/:id", staffController.getStaffById);      // Get staff by ID
// router.put("/:id", staffController.updateStaff);       // Update staff details
// router.delete("/:id", staffController.deleteStaffById);// Delete staff

// Staff Authentication
// router.post("/login", staffController.loginStaff);     // Staff login
// router.post("/logout", staffController.logoutStaff);   // Staff logout

// Salary Management
// router.get("/:id/salary", staffController.getSalaryDetails);   // Get salary info
// router.put("/:id/salary", staffController.updateSalaryDetails);// Update salary

// Profile Management
// router.put("/:id/profile", staffController.updateProfile);     // Update contact/image
// router.put("/:id/password", staffController.updatePassword);   // Change password

module.exports = router;
