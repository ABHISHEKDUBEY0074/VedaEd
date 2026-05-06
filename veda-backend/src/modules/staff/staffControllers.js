const Staff = require("./staffModels");
const StaffIdCounter = require("./staffIdCounterModel");
const StaffAttendance = require("./staffAttendanceModel");
const StaffLeave = require("./staffLeaveModel");
const StaffPayroll = require("./staffPayrollModel");

// ... existing code ...

const ALLOWED_LEAVE_STATUSES = ["Pending", "Approved", "Disapproved"];

const normalizeRole = (role) => String(role || "").toLowerCase().trim();

const hasAnyRole = (user, roles) => {
  const role = normalizeRole(user?.role);
  return roles.includes(role);
};

const normalizeLeaveStatus = (value) => {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "approved") return "Approved";
  if (raw === "disapproved" || raw === "rejected" || raw === "reject") return "Disapproved";
  if (raw === "pending") return "Pending";
  return null;
};

const parseDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const normalizeDuration = (value) => {
  const allowed = ["Full Day", "Multiple Days", "Half Day - First Half", "Half Day - Second Half"];
  return allowed.includes(value) ? value : "Full Day";
};

const leaveDaysInclusive = (fromDate, toDate) => {
  const from = parseDate(fromDate);
  const to = parseDate(toDate);
  if (!from || !to || to < from) return 0;
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.floor((toUtc - fromUtc) / 86400000) + 1;
};

const computeLeaveUnits = (fromDate, toDate, duration) => {
  if (String(duration || "").includes("Half")) return 0.5;
  return leaveDaysInclusive(fromDate, toDate);
};

// Staff apply leave
exports.applyStaffLeave = async (req, res) => {
  try {
    if (!hasAnyRole(req.user, ["staff", "teacher"])) {
      return res.status(403).json({ success: false, message: "Only staff users can apply for leave" });
    }
    if (!req.user?.refId) {
      return res.status(400).json({ success: false, message: "Staff reference missing in token" });
    }

    const { leaveType, fromDate, toDate, reason, duration } = req.body;
    const cleanLeaveType = String(leaveType || "").trim();
    const cleanReason = String(reason || "").trim();
    const cleanDuration = normalizeDuration(duration);
    const parsedFrom = parseDate(fromDate);
    const parsedTo = parseDate(toDate);

    if (!cleanLeaveType) {
      return res.status(400).json({ success: false, message: "leaveType is required" });
    }
    if (!parsedFrom || !parsedTo) {
      return res.status(400).json({ success: false, message: "Valid fromDate and toDate are required" });
    }
    if (parsedTo < parsedFrom) {
      return res.status(400).json({ success: false, message: "toDate cannot be before fromDate" });
    }
    if (cleanDuration.includes("Half") && parsedFrom.toDateString() !== parsedTo.toDateString()) {
      return res.status(400).json({ success: false, message: "Half-day leave must be for same start and end date" });
    }
    if (cleanDuration === "Multiple Days" && leaveDaysInclusive(parsedFrom, parsedTo) <= 1) {
      return res.status(400).json({ success: false, message: "Multiple Days leave requires a range of at least 2 days" });
    }
    if (!cleanReason) {
      return res.status(400).json({ success: false, message: "reason is required" });
    }

    const days = computeLeaveUnits(parsedFrom, parsedTo, cleanDuration);
    const leave = await StaffLeave.create({
      staff: req.user.refId,
      leaveType: cleanLeaveType,
      duration: cleanDuration,
      fromDate: parsedFrom,
      toDate: parsedTo,
      days,
      reason: cleanReason,
      status: "Pending",
      applyDate: new Date(),
    });

    const populated = await StaffLeave.findById(leave._id).populate(
      "staff",
      "personalInfo.name personalInfo.staffId"
    );

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave: populated,
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Staff self leave list
exports.getMyStaffLeaveRequests = async (req, res) => {
  try {
    if (!hasAnyRole(req.user, ["staff", "teacher"])) {
      return res.status(403).json({ success: false, message: "Only staff users can view own leave requests" });
    }
    if (!req.user?.refId) {
      return res.status(400).json({ success: false, message: "Staff reference missing in token" });
    }

    const leaves = await StaffLeave.find({ staff: req.user.refId })
      .populate("staff", "personalInfo.name personalInfo.staffId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching self leave requests:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Staff update own pending leave request
exports.updateMyStaffLeaveRequest = async (req, res) => {
  try {
    if (!hasAnyRole(req.user, ["staff", "teacher"])) {
      return res.status(403).json({ success: false, message: "Only staff users can update own leave requests" });
    }
    if (!req.user?.refId) {
      return res.status(400).json({ success: false, message: "Staff reference missing in token" });
    }

    const { id } = req.params;
    const { leaveType, fromDate, toDate, reason, duration } = req.body;
    const cleanLeaveType = String(leaveType || "").trim();
    const cleanReason = String(reason || "").trim();
    const cleanDuration = normalizeDuration(duration);
    const parsedFrom = parseDate(fromDate);
    const parsedTo = parseDate(toDate);

    if (!cleanLeaveType) {
      return res.status(400).json({ success: false, message: "leaveType is required" });
    }
    if (!parsedFrom || !parsedTo) {
      return res.status(400).json({ success: false, message: "Valid fromDate and toDate are required" });
    }
    if (parsedTo < parsedFrom) {
      return res.status(400).json({ success: false, message: "toDate cannot be before fromDate" });
    }
    if (cleanDuration.includes("Half") && parsedFrom.toDateString() !== parsedTo.toDateString()) {
      return res.status(400).json({ success: false, message: "Half-day leave must be for same start and end date" });
    }
    if (cleanDuration === "Multiple Days" && leaveDaysInclusive(parsedFrom, parsedTo) <= 1) {
      return res.status(400).json({ success: false, message: "Multiple Days leave requires a range of at least 2 days" });
    }
    if (!cleanReason) {
      return res.status(400).json({ success: false, message: "reason is required" });
    }

    const existing = await StaffLeave.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }
    if (String(existing.staff) !== String(req.user.refId)) {
      return res.status(403).json({ success: false, message: "You can only update your own leave request" });
    }
    if (existing.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending leave request can be updated" });
    }

    const days = computeLeaveUnits(parsedFrom, parsedTo, cleanDuration);
    const updated = await StaffLeave.findByIdAndUpdate(
      id,
      {
        leaveType: cleanLeaveType,
        duration: cleanDuration,
        fromDate: parsedFrom,
        toDate: parsedTo,
        days,
        reason: cleanReason,
      },
      { new: true }
    ).populate("staff", "personalInfo.name personalInfo.staffId");

    return res.status(200).json({
      success: true,
      message: "Leave request updated successfully",
      leave: updated,
    });
  } catch (error) {
    console.error("Error updating self leave request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all leave requests
exports.getStaffLeaveRequests = async (req, res) => {
  try {
    if (!hasAnyRole(req.user, ["hr", "admin"])) {
      return res.status(403).json({ success: false, message: "Only HR/Admin can view all leave requests" });
    }
    const leaves = await StaffLeave.find()
      .populate("staff", "personalInfo.name personalInfo.staffId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update leave status
exports.updateStaffLeaveStatus = async (req, res) => {
  try {
    if (!hasAnyRole(req.user, ["hr", "admin"])) {
      return res.status(403).json({ success: false, message: "Only HR/Admin can approve or reject leave" });
    }
    const { id } = req.params;
    const { status, note } = req.body;
    const normalizedStatus = normalizeLeaveStatus(status);
    if (!normalizedStatus || !ALLOWED_LEAVE_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Pending, Approved, Disapproved",
      });
    }
    const updated = await StaffLeave.findByIdAndUpdate(
      id,
      {
        status: normalizedStatus,
        note: typeof note === "string" ? note.trim() : "",
        reviewedBy: req.user?.userId || null,
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("staff", "personalInfo.name personalInfo.staffId");
    if (!updated) return res.status(404).json({ success: false, message: "Leave request not found" });
    res.status(200).json({ success: true, leave: updated });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const parseAmount = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const mapPaymentStatusToPayrollStatus = (status) => {
  return status === "Paid" ? "Paid" : "Pending";
};

// Get payroll for a month/year
exports.getStaffPayroll = async (req, res) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 1900) {
      return res.status(400).json({ success: false, message: "Valid month and year are required" });
    }

    let payrolls = await StaffPayroll.find({ month, year }).populate("staff", "personalInfo.name personalInfo.staffId personalInfo.role");

    // Seed monthly payroll rows for active staff when none exist yet.
    if (payrolls.length === 0) {
      const activeStaff = await Staff.find({ status: "Active" }).select("salaryDetails").lean();
      if (activeStaff.length > 0) {
        const seedDocs = activeStaff.map((staffDoc) => ({
          staff: staffDoc._id,
          month,
          year,
          basic: parseAmount(staffDoc?.salaryDetails?.salary),
          allowances: 0,
          deductions: 0,
          payStatus: mapPaymentStatusToPayrollStatus(staffDoc?.salaryDetails?.paymentStatus),
          note: "",
        }));

        try {
          await StaffPayroll.insertMany(seedDocs, { ordered: false });
        } catch (seedError) {
          // Ignore duplicate key races and continue with latest data fetch.
          if (seedError?.code !== 11000) {
            throw seedError;
          }
        }

        payrolls = await StaffPayroll.find({ month, year }).populate("staff", "personalInfo.name personalInfo.staffId personalInfo.role");
      }
    }

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
const UPLOADS_DIR = path.resolve(__dirname, "../../../public/uploads");

const safeDocumentPath = (filename) => {
  const normalizedFilename = path.basename(filename);
  return path.join(UPLOADS_DIR, normalizedFilename);
};

const rolePrefixes = {
  teacher: "TCH",
  admin: "ADM",
  accountant: "ACC",
  staff: "STF" // fallback
};

const generateStaffId = async () => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `TCH-${currentYear}-`;
  await ensureYearCounterInitialized(currentYear, yearPrefix);

  const counterDoc = await StaffIdCounter.findOneAndUpdate(
    { year: currentYear },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const paddedSequence = String(counterDoc.sequence).padStart(3, "0");
  return `TCH-${currentYear}-${paddedSequence}`;
};

const ensureYearCounterInitialized = async (currentYear, yearPrefix) => {
  const hasCounter = await StaffIdCounter.exists({ year: currentYear });
  if (hasCounter) return;

  const yearRegex = new RegExp(`^${yearPrefix}\\d+$`);
  const existingYearStaff = await Staff.find({
    "personalInfo.staffId": { $regex: yearRegex },
  })
    .select("personalInfo.staffId")
    .lean();

  const maxExistingSequence = existingYearStaff.reduce((max, staff) => {
    const value = staff?.personalInfo?.staffId || "";
    const sequencePart = value.split("-")[2];
    const parsed = Number(sequencePart);
    return Number.isInteger(parsed) ? Math.max(max, parsed) : max;
  }, 0);

  await StaffIdCounter.findOneAndUpdate(
    { year: currentYear },
    { $setOnInsert: { sequence: maxExistingSequence } },
    { upsert: true }
  );
};

exports.getNextStaffIdPreview = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `TCH-${currentYear}-`;
    await ensureYearCounterInitialized(currentYear, yearPrefix);
    const counterDoc = await StaffIdCounter.findOne({ year: currentYear }).lean();
    const nextSequence = (counterDoc?.sequence || 0) + 1;
    const nextStaffId = `TCH-${currentYear}-${String(nextSequence).padStart(3, "0")}`;
    return res.status(200).json({ success: true, staffId: nextStaffId });
  } catch (error) {
    console.error("Error generating next staff id preview:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createStaff = async (req, res) => {
  const { personalInfo, status } = req.body;
  try {
    const requiredFields = ["name", "role", "email", "password", "department"];
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
    personalInfo.staffId = await generateStaffId();
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

    // Create User record for auth
    try {
      let roleName = "staff"; // default
      if (personalInfo.role === "Teacher") roleName = "teacher";
      else if (personalInfo.role === "Admin") roleName = "admin";
      else if (personalInfo.role === "HR") roleName = "hr";
      else if (personalInfo.role === "Receptionist") roleName = "receptionist";
      else if (personalInfo.role === "Admission") roleName = "admission";

      const roleDoc = await require('../../models/Role').findOne({ name: roleName });
      if (roleDoc) {
        await require('../../models/User').create({
          name: personalInfo.name,
          email: personalInfo.email || personalInfo.username,
          password: personalInfo.password,
          roleId: roleDoc._id,
          refId: newStaff._id,
          status: 'active'
        });
        console.log("Auth User created for staff");
      }
    } catch (err) {
      console.error("Auth User creation failed for staff:", err.message);
    }
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
    const staff = await Staff.find().sort({ createdAt: -1 });
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
    const unhashedPassword = updateData.personalInfo?.password || null;
    const updateFields = {};
    if (updateData.personalInfo) {
      Object.keys(updateData.personalInfo).forEach(key => {
        if (key === "staffId") return;
        updateFields[`personalInfo.${key}`] = updateData.personalInfo[key];
      });
    }
    // Keep top-level profile fields in sync when profile screen sends them.
    if (Object.prototype.hasOwnProperty.call(updateData, "status")) {
      updateFields.status = updateData.status;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "qualification")) {
      updateFields.qualification = updateData.qualification;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "experience")) {
      const rawExperience = updateData.experience;
      if (typeof rawExperience === "number") {
        updateFields.experience = rawExperience;
      } else if (typeof rawExperience === "string") {
        const matchedYears = rawExperience.trim().match(/^(\d+)/);
        if (matchedYears) {
          updateFields.experience = Number(matchedYears[1]);
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "joiningDate")) {
      updateFields.joiningDate = updateData.joiningDate;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "classesAssigned")) {
      updateFields.classesAssigned = updateData.classesAssigned;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "salaryDetails")) {
      updateFields.salaryDetails = updateData.salaryDetails;
      // Backward compatibility for legacy reads still using top-level payStatus.
      if (Object.prototype.hasOwnProperty.call(updateData.salaryDetails, "paymentStatus")) {
        updateFields.payStatus = updateData.salaryDetails.paymentStatus;
      }
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

    // Sync Auth User
    try {
      const user = await require('../../models/User').findOne({ refId: id });
      if (user) {
        user.name = updateData.personalInfo?.name || user.name;
        user.email = (updateData.personalInfo?.email || updateData.personalInfo?.username) || user.email;
        if (updateData.personalInfo?.password) {
          user.password = req.body.personalInfo.password;
        }
        await user.save();
      }
    } catch (err) {
      console.error("Auth User sync failed for staff:", err.message);
    }

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

    // Cleanup Auth User
    try {
      await require('../../models/User').findOneAndDelete({ refId: id });
    } catch (err) {
      console.error("Auth User cleanup failed for staff:", err.message);
    }

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
    const savedDocument = staff.documents[staff.documents.length - 1];
    res.status(201).json({ success: true, message: "Document uploaded successfully", document: savedDocument });
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
    const filePath = safeDocumentPath(filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = safeDocumentPath(filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { staffId, documentId } = req.params;
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });

    const targetDocument = staff.documents.id(documentId);
    if (!targetDocument) return res.status(404).json({ success: false, message: "Document not found" });

    if (targetDocument.path) {
      const filename = path.basename(targetDocument.path);
      const filePath = safeDocumentPath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    staff.documents.pull({ _id: documentId });
    await staff.save();

    return res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
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