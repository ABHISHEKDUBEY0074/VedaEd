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
    applyDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Disapproved'],
        default: 'Pending',
    },
    note: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('StaffLeave', staffLeaveSchema);
