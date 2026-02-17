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
    eventType: {
        type: String, // 'Meeting', 'Holiday', 'Task', 'Reminder', 'Other'
        default: 'Other'
    },
    allDay: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        trim: true
    },
    visibility: {
        type: String, // 'Public', 'Private', 'Default visibility'
        default: 'Default visibility'
    },
    busyStatus: {
        type: String, // 'Busy', 'Free'
        default: 'Busy'
    },
    notification: {
        type: String,
        default: '30 minutes before'
    },
    attendees: {
        type: String, // Comma separated emails or IDs
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model, or can be generic
    }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
