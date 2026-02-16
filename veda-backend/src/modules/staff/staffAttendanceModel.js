const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Half Day', 'Holiday'],
        required: true,
    },
    note: {
        type: String,
    }
}, { timestamps: true });

// Prevent multiple attendance for same staff on same day
staffAttendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
