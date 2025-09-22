const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// const authRouter = require('./routes/authRoutes');
// const vendorRoutes = require('./routes/vendorRoutes');
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

// Middlewares
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:false})); 
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
