const ExamTimetable = require("./examTimetableModel");
const fs = require("fs");
const path = require("path");
const Student = require("../student/studentModels");

// Upload Exam Timetable
exports.uploadExamTimetable = async (req, res) => {
    try {
        const { title, classId, sectionId, examType } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const newTimetable = new ExamTimetable({
            title,
            class: classId,
            section: sectionId,
            examType,
            file: req.file.path.replace(/\\/g, "/"), // normalize path
            uploadedBy: req.user?._id // Assuming auth middleware attaches user
        });

        await newTimetable.save();

        res.status(201).json({ success: true, message: "Exam timetable uploaded successfully", data: newTimetable });
    } catch (error) {
        console.error("Error uploading exam timetable:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get All Exam Timetables
exports.getExamTimetables = async (req, res) => {
    try {
        const { classId, sectionId, examType } = req.query;
        const filter = {};

        if (classId) filter.class = classId;
        if (sectionId) filter.section = sectionId;
        if (examType) filter.examType = examType;

        // Restrict student access to only their class + section timetables.
        if (req.user?.role === "student") {
            const student = await Student.findById(req.user.refId).select("personalInfo.class personalInfo.section");
            const studentClass = student?.personalInfo?.class;
            const studentSection = student?.personalInfo?.section;

            if (!studentClass || !studentSection) {
                return res.json({ success: true, count: 0, data: [] });
            }

            filter.class = studentClass;
            filter.section = studentSection;
        }

        const timetables = await ExamTimetable.find(filter)
            .populate("class", "name")
            .populate("section", "name")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: timetables.length, data: timetables });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Exam Timetable
exports.deleteExamTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const timetable = await ExamTimetable.findById(id);

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        // Delete file from server
        if (timetable.file) {
            // Adjust path resolution based on your project structure. 
            // Assuming 'file' stored as 'uploads/filename...'.
            // If absolute path stored, validation needed. 
            // Safe bet: verify if it starts with uploads/ or matches relative pattern

            // Let's assume file path is relative to project root or stored as relative path
            // If using same upload middleware as assignment, it's relative.
            // But fs.unlink needs absolute path usually or relative to cwd.
            // We will try both or just skip if fail, but log it.

            try {
                // If path is stored like "public/uploads/file.pdf"
                fs.unlinkSync(timetable.file);
            } catch (err) {
                console.warn("Could not delete file from filesystem:", err.message);
            }
        }

        await timetable.deleteOne();
        res.json({ success: true, message: "Exam timetable deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
