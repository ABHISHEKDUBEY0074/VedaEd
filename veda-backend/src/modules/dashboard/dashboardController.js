const Student = require("../student/studentModels");
const Staff = require("../staff/staffModels");
const Class = require("../class/classSchema");

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Staff.countDocuments();
    const totalClasses = await Class.countDocuments();

    res.json({
      students: totalStudents,
      teachers: totalTeachers,
      classes: totalClasses,
      other: 1234 // placeholder, you can calculate real data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};