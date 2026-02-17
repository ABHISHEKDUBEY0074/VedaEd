const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        required: true,
        default: '#4285f4'
    },
    visibility: {
        type: String, // 'Public', 'Private', 'Everyone', 'Specific Groups', 'Draft'
        default: 'Draft'
    },
    icon: {
        type: String, // Optional icon identifier if stored as string
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('EventType', eventTypeSchema);
