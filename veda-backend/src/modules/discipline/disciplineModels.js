const mongoose = require("mongoose");

const DisciplineSchema = new mongoose.Schema({
    className: { type: String, required: true },
    section: { type: String, required: true },
    student: { type: String, required: true },
    incident: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    status: { type: String, enum: ['Open', 'Monitoring', 'Resolved', 'Escalated'], default: 'Open' },
    action: { type: String },
    date: { type: String },
    classTeacher: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Discipline", DisciplineSchema);
