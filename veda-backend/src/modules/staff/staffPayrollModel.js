const mongoose = require('mongoose');

const staffPayrollSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    month: {
        type: Number, // 1-12
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    basic: {
        type: Number,
        default: 0,
    },
    allowances: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    payStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    note: {
        type: String,
    }
}, { timestamps: true });

// Ensure unique payroll per staff per month/year
staffPayrollSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('StaffPayroll', staffPayrollSchema);
