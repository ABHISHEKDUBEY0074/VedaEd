const Attendance = require("./attendenceSchema");
const Student = require("../student/studentModels");

/*
 * Mark attendance for an entire class (bulk insert)
 * req.body = {
 *   classId, sectionId, date,
 *   records: [
 *     { studentId, status, time },
 *     { studentId, status, time }
 *   ]
 * }
 */

// Mark attendance for an entire class
exports.markClassAttendance = async (req, res) => {
  try {
    const { classId, sectionId, date, records } = req.body;

    if (!classId || !sectionId || !date || !records || records.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Remove existing attendance for the same date/class/section (so teacher can re-mark)
    await Attendance.deleteMany({ class: classId, section: sectionId, date });

    // Insert all student attendance records
    const newRecords = records.map(r => ({
      student: r.studentId,
      class: classId,
      section: sectionId,
      date,
      status: r.status,
      time: r.time || null
    }));

    const saved = await Attendance.insertMany(newRecords);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      count: saved.length,
      data: saved
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


/*
 * Get attendance by class & section for a specific date
 * req.query = { classId, sectionId, date }
 */

// Get attendance by class + section + date
exports.getAttendanceByClass = async (req, res) => {
  try {
    const { classId, sectionId, date } = req.params;

    if (!classId || !sectionId || !date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Normalize date to start/end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      class: classId,
      section: sectionId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("student", "personalInfo.name personalInfo.rollNo");

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.updateAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, status, time } = req.body;

    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: "Date and status are required",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Normalize date (start of the day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find attendance for this student on that day
    let attendance = await Attendance.findOne({
      student: studentId,
      class: student.personalInfo.class,
      section: student.personalInfo.section,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!attendance) {
      // Create new attendance doc
      attendance = new Attendance({
        student: studentId,
        class: student.personalInfo.class,
        section: student.personalInfo.section,
        date: startOfDay,
        status,
        time: status === "Absent" ? "--" : (time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      });
    } else {
      // Update existing doc
      attendance.status = status;
      attendance.time = status === "Absent" ? "--" : (time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated for student",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get attendance history of a student
// exports.getAttendanceByStudent = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     if (!studentId) {
//       return res.status(400).json({ success: false, message: "Student ID required" });
//     }

//     const records = await Attendance.find({ student: studentId })
//       .populate("class", "name")
//       .populate("section", "name");

//     res.status(200).json({
//       success: true,
//       count: records.length,
//       data: records
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID required",
      });
    }

    const records = await Attendance.find({ student: studentId })
      .populate("class", "name")
      .populate("section", "name")
      .sort({ date: -1 }); // latest first

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for this student",
      });
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records.map(r => ({
        date: r.date,
        class: r.class?.name,
        section: r.section?.name,
        status: r.status,
        time: r.time,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Get weekly attendance statistics
exports.getWeeklyStats = async (req, res) => {
  try {
    // Get current week's attendance data
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    const weeklyStats = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfWeek,
            $lte: endOfWeek
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$date" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format data for frontend
    const formattedData = [
      { day: "Mon", attendance: 85 },
      { day: "Tue", attendance: 90 },
      { day: "Wed", attendance: 75 },
      { day: "Thu", attendance: 95 },
      { day: "Fri", attendance: 80 }
    ];

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};