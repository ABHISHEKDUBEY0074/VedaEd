const AssignTeacher = require("./assignTeacherSchema");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Staff = require("../staff/staffModels");

exports.assignTeachers = async (req, res) => {
  const { classId, sectionId, teachers, classTeacher } = req.body;
  try {
    if (
      !classId ||
      !sectionId ||
      !teachers ||
      teachers.length === 0 ||
      !classTeacher
    )
      return res.status(400).json({
        success: false,
        message: "required fields missing",
      });

    const staffFound = await Staff.find({
      _id: { $in: teachers },
      "personalInfo.role": "Teacher",
    });
    if (staffFound.length !== teachers.length) {
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
    const assigned = await AssignTeacher.find()
      .populate("class", "name")
      .populate("section", "name")
      .populate("teachers", "personalInfo.name personalInfo.staffId")
      .populate("classTeacher", "personalInfo.name personalInfo.staffId");

    res.status(200).json({
      success: true,
      count: assigned.length,
      data: assigned,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
