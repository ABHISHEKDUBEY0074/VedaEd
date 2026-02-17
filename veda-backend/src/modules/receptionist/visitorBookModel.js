const mongoose = require('mongoose');

const visitorBookSchema = new mongoose.Schema({
    purpose: {
        type: String,
        required: true,
    },
    meetingWith: {
        type: String,
        required: true,
    },
    visitorName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    idCard: {
        type: String,
    },
    numberOfPerson: {
        type: Number,
        default: 1,
    },
    date: {
        type: String, // YYYY-MM-DD
    },
    inTime: {
        type: String,
    },
    outTime: {
        type: String,
    },
    note: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('VisitorBook', visitorBookSchema);
