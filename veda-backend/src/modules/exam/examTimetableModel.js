const mongoose = require("mongoose");

const examTimetableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    examType: {
        type: String,
        enum: ["Unit Test", "Half Yearly", "Final Exam", "Other"],
        required: true,
    },
    file: {
        type: String, // Path to uploaded file
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    }
}, { timestamps: true });

module.exports = mongoose.model("ExamTimetable", examTimetableSchema);
