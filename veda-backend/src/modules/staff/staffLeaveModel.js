const mongoose = require('mongoose');

const staffLeaveSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: String,
        enum: ["Full Day", "Multiple Days", "Half Day - First Half", "Half Day - Second Half"],
        default: "Full Day",
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    days: {
        type: Number,
    },
    effectiveDays: {
        type: Number,
    },
    paidDays: {
        type: Number,
    },
    unpaidDays: {
        type: Number,
    },
    applyDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Disapproved', 'Cancelled'],
        default: 'Pending',
    },
    note: {
        type: String,
        trim: true,
        default: "",
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('StaffLeave', staffLeaveSchema);
