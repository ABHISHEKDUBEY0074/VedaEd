const AssignTeacher = require("./assignTeacherSchema");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Staff = require("../staff/staffModels");

exports.assignTeachers = async (req, res) => {
  const { classId, sectionId, teachers, classTeacher } = req.body;
  console.log("AssignTeachers request body:", req.body);
  try {
    if (
      !classId ||
      !sectionId ||
      !teachers ||
      teachers.length === 0 ||
      !classTeacher
    ) {
      console.log("Missing required fields:", { classId, sectionId, teachers, classTeacher });
      return res.status(400).json({
        success: false,
        message: "required fields missing",
      });
    }

    console.log("Looking for staff with IDs:", teachers);
    const staffFound = await Staff.find({
      _id: { $in: teachers },
      "personalInfo.role": "Teacher",
    });
    console.log("Found staff:", staffFound.length, "out of", teachers.length);
    console.log("Staff details:", staffFound.map(s => ({ id: s._id, role: s.personalInfo?.role, name: s.personalInfo?.name })));
    
    if (staffFound.length !== teachers.length) {
      console.log("Some staff members are not valid teachers");
      return res.status(400).json({
        success: false,
        message: "Some staff members are not valid teachers",
      });
    }

    // Ensure class teacher is in teachers list
    if (!teachers.includes(classTeacher)) {
      return res.status(400).json({
        success: false,
        message: "Class Teacher must be one of the assigned teachers",
      });
    }

    // Check if assignment already exists
    const existing = await AssignTeacher.findOne({
      class: classId,
      section: sectionId,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Teachers already assigned to this class & section",
      });
    }

    const newAssignment = await AssignTeacher.create({
      class: classId,
      section: sectionId,
      teachers,
      classTeacher,
    });
    const response = await AssignTeacher.findById(newAssignment._id)
      .populate("class", "name")
      .populate("section", "name")
      .populate("teachers", "personalInfo.name personalInfo.staffId")
      .populate("classTeacher", "personalInfo.name personalInfo.staffId");

    res.status(201).json({
      success: true,
      message: "Teachers assigned successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


exports.getAllAssignedTeachers = async (req, res) => {
  try {
    console.log("Getting all assigned teachers...");
    const assigned = await AssignTeacher.find()
      .populate("class", "name")
      .populate("section", "name")
      .populate("teachers", "personalInfo.name personalInfo.staffId")
      .populate("classTeacher", "personalInfo.name personalInfo.staffId");

    console.log("Found assigned teachers:", assigned.length);
    console.log("Assigned teachers data:", assigned);

    res.status(200).json({
      success: true,
      count: assigned.length,
      data: assigned,
    });

  } catch (err) {
    console.error("Error getting assigned teachers:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
