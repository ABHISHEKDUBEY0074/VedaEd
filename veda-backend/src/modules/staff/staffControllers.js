const Staff = require("./staffModels");
const StaffAttendance = require("./staffAttendanceModel");
const StaffLeave = require("./staffLeaveModel");
const StaffPayroll = require("./staffPayrollModel");

// ... existing code ...

// Get all leave requests
exports.getStaffLeaveRequests = async (req, res) => {
  try {
    const leaves = await StaffLeave.find().populate("staff", "personalInfo.name personalInfo.staffId");
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update leave status
exports.updateStaffLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const updated = await StaffLeave.findByIdAndUpdate(id, { status, note }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Leave request not found" });
    res.status(200).json({ success: true, leave: updated });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get payroll for a month/year
exports.getStaffPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const payrolls = await StaffPayroll.find({ month, year }).populate("staff", "personalInfo.name personalInfo.staffId personalInfo.role");
    res.status(200).json({ success: true, payrolls });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update payroll status
exports.updateStaffPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { payStatus, note } = req.body;
    const updated = await StaffPayroll.findByIdAndUpdate(id, { payStatus, note }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Payroll record not found" });
    res.status(200).json({ success: true, payroll: updated });
  } catch (error) {
    console.error("Error updating payroll:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const rolePrefixes = {
  teacher: "TCH",
  admin: "ADM",
  accountant: "ACC",
  staff: "STF" // fallback
};

exports.createStaff = async (req, res) => {
  const { personalInfo, status } = req.body;
  try {
    const requiredFields = ["name", "staffId", "role", "email", "password", "department"];
    for (let fields of requiredFields) {
      if (!personalInfo[fields]) {
        return res.status(400).json({
          success: false,
          message: `${fields} is required`
        })
      }
    }
    if (personalInfo.role) {
      const validRoles = ["Teacher", "Principal", "Accountant", "Admin", "HR", "Other"];
      const normalizedRole = personalInfo.role.charAt(0).toUpperCase() + personalInfo.role.slice(1).toLowerCase();
      if (validRoles.includes(normalizedRole)) {
        personalInfo.role = normalizedRole;
      }
    }
    if (!personalInfo.username) {
      personalInfo.username = `${personalInfo.role}_${personalInfo.staffId}`;
    }
    const staffData = {
      personalInfo,
      status
    };
    if (personalInfo.assignedClasses) {
      staffData.classesAssigned = personalInfo.assignedClasses;
      delete personalInfo.assignedClasses;
    }
    const newStaff = await Staff.create(staffData);
    const staff = await Staff.findById(newStaff._id);
    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staff: staff
    })
  }
  catch (error) {
    console.error("Error creating Staff:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json({
      success: true,
      staff: staff
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(404).json({ success: false, message: "ID invalid/missing" });
    const staffDoc = await Staff.findById(id);
    if (!staffDoc) return res.status(404).json({ success: false, message: "Staff not found" });
    res.status(200).json({ success: true, staff: staffDoc })
  } catch (error) {
    console.error("Error Viewing Staff Profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    if (!id) return res.status(404).json({ success: false, message: "ID invalid/missing" });
    const existingStaff = await Staff.findById(id);
    if (!existingStaff) return res.status(404).json({ success: false, message: "Staff not found" });
    let unhashedPassword = null;
    if (updateData.personalInfo?.password) {
      unhashedPassword = updateData.personalInfo.password;
      updateData.personalInfo.password = await bcrypt.hash(updateData.personalInfo.password, 10);
    }
    const updateFields = {};
    if (updateData.personalInfo) {
      Object.keys(updateData.personalInfo).forEach(key => {
        updateFields[`personalInfo.${key}`] = updateData.personalInfo[key];
      });
    }
    const updatedStaff = await Staff.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: false });
    if (!updatedStaff) return res.status(404).json({ success: false, message: "Staff not found" });
    const responseData = {
      ...updatedStaff.toObject(),
      personalInfo: {
        ...updatedStaff.personalInfo,
        password: unhashedPassword || updatedStaff.personalInfo.password
      }
    };
    res.status(200).json({ success: true, message: "Staff updated successfully", staff: responseData });
  } catch (error) {
    console.error("Error in updateStaff:", error);
    res.status(500).json({ success: false, message: "Error updating staff", error: error.message });
  }
}

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ success: false, message: "ID invalid/missing" });
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ success: false, message: "Staff ID is required" });
    const fileUrl = `/uploads/${req.file.filename}`;
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    if (!staff.documents) staff.documents = [];
    const documentData = {
      name: req.file.originalname,
      path: fileUrl,
      size: req.file.size,
      uploadedAt: new Date(),
    };
    staff.documents.push(documentData);
    await staff.save();
    res.status(201).json({ success: true, message: "Document uploaded successfully", document: documentData });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId).select("documents");
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.status(200).json(staff.documents || []);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.previewDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../public/uploads", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../public/uploads", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeacherDashboardStats = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Staff.findById(id);
    res.status(200).json({
      success: true,
      stats: {
        classes: teacher?.classesAssigned?.length || 6,
        assignments: 12,
        attendance: 92,
        lecturesToday: 3,
      }
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.markStaffAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    if (!Array.isArray(attendanceRecords)) return res.status(400).json({ success: false, message: "Invalid attendance records" });
    const operations = attendanceRecords.map(record => ({
      updateOne: {
        filter: { staff: record.staff, date: new Date(new Date(record.date).setHours(0, 0, 0, 0)) },
        update: { $set: { status: record.status, note: record.note } },
        upsert: true
      }
    }));
    await StaffAttendance.bulkWrite(operations);
    res.status(200).json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking staff attendance:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getStaffAttendance = async (req, res) => {
  try {
    const { date, role } = req.query;
    if (!date) return res.status(400).json({ success: false, message: "Date is required" });
    const searchDate = new Date(new Date(date).setHours(0, 0, 0, 0));
    const staffQuery = {};
    if (role) staffQuery["personalInfo.role"] = role;
    const allStaff = await Staff.find(staffQuery);
    const attendanceRecords = await StaffAttendance.find({
      date: searchDate,
      staff: { $in: allStaff.map(s => s._id) }
    });
    const result = allStaff.map(staff => {
      const attendance = attendanceRecords.find(a => a.staff.toString() === staff._id.toString());
      return {
        _id: staff._id,
        name: staff.personalInfo.name,
        staffId: staff.personalInfo.staffId,
        role: staff.personalInfo.role,
        attendance: attendance ? attendance.status : null,
        note: attendance ? attendance.note : ""
      };
    });
    res.status(200).json({ success: true, attendance: result });
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};