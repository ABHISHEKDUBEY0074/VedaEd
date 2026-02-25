const mongoose = require('mongoose');

const frontOfficeSetupSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Purpose', 'Complaint Type', 'Source', 'Reference'],
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('FrontOfficeSetup', frontOfficeSetupSchema);
