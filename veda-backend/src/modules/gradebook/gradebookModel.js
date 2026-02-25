const mongoose = require("mongoose");

const gradebookSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
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
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    academicYear: {
        type: String,
        required: true, // e.g. "2023-24"
    },
    term: {
        type: String,
        required: true, // e.g. "Unit Exam", "Mid Term", "Final Exam"
    },
    marks: [
        {
            unitIndex: { type: Number, required: true },
            theory: { type: Number, default: 0 },
            practical: { type: Number, default: 0 },
        }
    ],
    isLocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Index for performance and uniqueness
gradebookSchema.index({ student: 1, class: 1, section: 1, subject: 1, term: 1, academicYear: 1 }, { unique: true });

const Gradebook = mongoose.model("Gradebook", gradebookSchema);
module.exports = Gradebook;
