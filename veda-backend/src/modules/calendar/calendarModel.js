const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    type: {
        type: String, // 'Assignment', 'Exam', 'Meeting', 'Holiday'
        required: true
    },
    source: {
        type: String, // 'Manual', 'Auto'
        default: 'Manual'
    },
    category: {
        type: String, // 'Primary', 'Secondary', 'Higher Secondary'
    },
    classes: [{
        type: String
    }],
    sections: [{
        type: String
    }],
    venue: {
        type: String,
        trim: true
    },
    status: {
        type: String, // 'Scheduled', 'Completed'
        default: 'Scheduled'
    },
    priority: {
        type: String, // 'Low', 'Normal', 'High'
        default: 'Normal'
    },
    reminder: {
        type: String,
        default: '1 day before'
    },
    visibility: [{
        type: String // 'Admin', 'Teacher', 'Student', 'Parent', 'Management'
    }],
    createdBy: {
        type: String,
        default: 'Admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
