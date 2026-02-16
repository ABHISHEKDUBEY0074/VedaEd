const Student = require("../student/studentModels");
const Staff = require("../staff/staffModels");
const Class = require("../class/classSchema");
const Notice = require("../communication/noticeModel");
const Complaint = require("../communication/complaintModel");
const AdmissionApplication = require("../admission/admissionApplicationModel");
const AdmissionEnquiry = require("../admission/admissionEnquiryModel");

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Staff.countDocuments();
    const totalClasses = await Class.countDocuments();

    res.json({
      students: totalStudents,
      teachers: totalTeachers,
      classes: totalClasses,
      other: 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMasterDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalStaff,
      totalClasses,
      totalNotices,
      totalComplaints,
      totalApplications,
      totalEnquiries
    ] = await Promise.all([
      Student.countDocuments(),
      Staff.countDocuments(),
      Class.countDocuments(),
      Notice.countDocuments(),
      Complaint.countDocuments(),
      AdmissionApplication.countDocuments(),
      AdmissionEnquiry.countDocuments()
    ]);

    // Get gender ratio for students
    const genderRatio = await Student.aggregate([
      {
        $group: {
          _id: "$personalInfo.gender",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get students by class for pie chart
    const studentsByClass = await Student.aggregate([
      {
        $group: {
          _id: "$personalInfo.class",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        sis: {
          totalStudents,
          totalStaff,
          totalClasses,
          studentsByClass: studentsByClass.map(item => ({ name: `Class ${item._id}`, value: item.count })),
          genderRatio: genderRatio.map(item => ({ name: item._id || 'Unknown', value: item.count }))
        },
        communication: {
          totalNotices,
          totalComplaints,
          totalMessages: 0 // Placeholder until message model is confirmed
        },
        admission: {
          totalApplications,
          totalEnquiries,
          confirmedAdmissions: await AdmissionApplication.countDocuments({ status: "Approved" }) // Adjusted to probable status
        },
        hr: {
          totalStaff
        },
        calendar: {
          totalEvents: 0 // Placeholder
        },
        fees: {
          collected: 0,
          pending: 0
        }
      }
    });
  } catch (err) {
    console.error("Error in getMasterDashboardStats:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
