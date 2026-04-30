const ExamTimetable = require("./examTimetableModel");
const fs = require("fs");
const path = require("path");
const Student = require("../student/studentModels");
const Parent = require("../parents/parentModel");
const AssignTeacher = require("../assignTeachersToClass/assignTeacherSchema");

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
        const { classId, sectionId, examType, studentId } = req.query;
        const filter = {};

        if (classId) filter.class = classId;
        if (sectionId) filter.section = sectionId;
        if (examType) filter.examType = examType;

        // RBAC: If student, filter by their class, section and allotted teachers
        if (req.user?.role === "student") {
            const student = await Student.findById(req.user.refId).select("personalInfo.class personalInfo.section");
            if (student && student.personalInfo?.class && student.personalInfo?.section) {
                filter.class = student.personalInfo.class;
                filter.section = student.personalInfo.section;

                const assigned = await AssignTeacher.findOne({ class: filter.class, section: filter.section });
                if (assigned && assigned.teachers && assigned.teachers.length > 0) {
                    filter.$or = [
                        { uploadedBy: { $in: assigned.teachers } },
                        { uploadedBy: { $exists: false } },
                        { uploadedBy: null }
                    ];
                }
            } else {
                return res.json({ success: true, count: 0, data: [] });
            }
        }

        // RBAC: If parent, filter by their children's class, section and allotted teachers
        if (req.user?.role === "parent") {
            const parent = await Parent.findById(req.user.refId).populate("children");
            if (parent && parent.children && parent.children.length > 0) {
                let targets = [];
                
                if (studentId) {
                    const child = parent.children.find(c => c._id.toString() === studentId);
                    if (child && child.personalInfo?.class && child.personalInfo?.section) {
                        targets.push({ class: child.personalInfo.class, section: child.personalInfo.section });
                    }
                } else {
                    targets = parent.children
                        .filter(c => c.personalInfo?.class && c.personalInfo?.section)
                        .map(c => ({ class: c.personalInfo.class, section: c.personalInfo.section }));
                }

                if (targets.length > 0) {
                    const orConditions = await Promise.all(targets.map(async (t) => {
                        const assigned = await AssignTeacher.findOne({ class: t.class, section: t.section });
                        const teachers = assigned?.teachers || [];
                        
                        const teacherFilter = teachers.length > 0 ? {
                            $or: [
                                { uploadedBy: { $in: teachers } },
                                { uploadedBy: { $exists: false } },
                                { uploadedBy: null }
                            ]
                        } : {};

                        return {
                            class: t.class,
                            section: t.section,
                            ...teacherFilter
                        };
                    }));
                    filter.$or = orConditions;
                } else {
                    return res.json({ success: true, count: 0, data: [] });
                }
            } else {
                return res.json({ success: true, count: 0, data: [] });
            }
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
