const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// const authRouter = require('./routes/authRoutes');
// const vendorRoutes = require('./routes/vendorRoutes');
const dashboardRoutes = require('./modules/dashboard/dashboardRoutes');
const studentRoutes = require("./modules/student/studentRoutes");
const staffRoutes = require("./modules/staff/staffRoutes");
const parentRoutes = require("./modules/parents/parentRoutes");
const sectionRoutes = require('./modules/section/sectionRoutes');
const classRoutes = require('./modules/class/classRoutes');
const subjectRoutes = require("./modules/subject/subjectRoutes");
const subjectGroupRoutes = require("./modules/subGroup/subGroupRoutes");
const assignTeacherRoutes = require("./modules/assignTeachersToClass/assignTeacherRoutes");
const timetableRoutes = require("./modules/Timetable/timeTableRoutes");
const attendanceRoutes = require("./modules/attendence/attendenceRoutes");
const assignmentRoutes = require("./modules/assignment/assignmentRoutes");
const communicationRoutes = require("./modules/communication/communicationRoutes");
const examTimetableRoutes = require("./modules/exam/examTimetableRoutes");
const admissionEnquiryRoutes = require("./modules/admission/admissionEnquiryRoutes");
const admissionApplicationRoutes = require("./modules/admission/admissionApplicationRoutes");
const vacancyRoutes = require("./modules/admission/vacancyRoutes");

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));


app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/parents", parentRoutes);
//class & Schedule
app.use("/api/sections", sectionRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/subGroups", subjectGroupRoutes);
app.use("/api/assignTeachers", assignTeacherRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/exam-timetables", examTimetableRoutes);
app.use("/api/admission-enquiry", admissionEnquiryRoutes);
app.use("/api/admission/application", admissionApplicationRoutes);
app.use("/api/admission/vacancy", vacancyRoutes);
app.use("/api/discipline", require("./modules/discipline/disciplineRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
