const Gradebook = require("./gradebookModel");
const Student = require("../student/studentModels");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Subject = require("../subject/subjectSchema");

// Save or Update Marks for Multiple Students
exports.saveMarks = async (req, res) => {
    try {
        const {
            classId,
            sectionId,
            subjectId,
            academicYear,
            term,
            studentMarks, // Array of { studentId, marks: [ { unitIndex, theory, practical } ] }
            isLocked
        } = req.body;

        if (!classId || !sectionId || !subjectId || !academicYear || !term || !studentMarks) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const operations = studentMarks.map(item => ({
            updateOne: {
                filter: {
                    student: item.studentId,
                    class: classId,
                    section: sectionId,
                    subject: subjectId,
                    term,
                    academicYear
                },
                update: {
                    $set: {
                        marks: item.marks,
                        isLocked: isLocked || false
                    }
                },
                upsert: true
            }
        }));

        await Gradebook.bulkWrite(operations);

        res.status(200).json({ success: true, message: "Marks saved successfully" });
    } catch (error) {
        console.error("Error saving marks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get Marks for a Class, Section, Subject, and Term
exports.getMarks = async (req, res) => {
    try {
        const { classId, sectionId, subjectId, academicYear, term } = req.query;

        if (!classId || !sectionId || !academicYear || !term) {
            return res.status(400).json({ success: false, message: "Missing query parameters" });
        }

        const query = {
            class: classId,
            section: sectionId,
            academicYear,
            term
        };

        if (subjectId) {
            query.subject = subjectId;
        }

        const marks = await Gradebook.find(query)
            .populate("student", "personalInfo.name personalInfo.rollNo")
            .populate("subject", "subjectName");

        res.status(200).json({ success: true, marks });
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get Students for Gradebook Entry (Filtered by Class and Section)
exports.getStudentsForGradebook = async (req, res) => {
    try {
        const { className, sectionName } = req.query;

        if (!className || !sectionName) {
            return res.status(400).json({ success: false, message: "Class and Section names are required" });
        }

        const existClass = await Class.findOne({ name: className });
        const existSection = await Section.findOne({ name: sectionName });

        if (!existClass || !existSection) {
            return res.status(404).json({ success: false, message: "Class or Section not found" });
        }

        const students = await Student.find({
            "personalInfo.class": existClass._id,
            "personalInfo.section": existSection._id,
            "personalInfo.status": "Active"
        }).select("personalInfo.name personalInfo.rollNo _id");

        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error("Error fetching students for gradebook:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
