const mongoose = require('mongoose');

const admissionEnquirySchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    guardianName: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    whatsapp: {
        type: String,
    },
    email: {
        type: String,
    },
    enquiryClass: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        // Keeping as String to match frontend "YYYY-MM-DD" format from input type="date", 
        // or we could use Date type. Let's use String for simplicity as per existing frontend usage 
        // or Date if we want better querying. Frontend sends "2024-01-01".
        // Let's use Date for better practice, but frontend sends string from input. 
        // Mongoose casts strings to dates automatically if they are valid.
        // However, looking at the frontend, it just stores what the input gives.
        // Let's use String to be safe with exactly what UI sends, or Date. 
        // Usually Date is better. Let's stick to String for now to avoid timezone issues 
        // unless granular sorting is needed, as it's just a record.
        // Actually, let's use Date type but handle the string.
        // Re-reading frontend: `value={formData.date}` (input type=date).
        // Let's use String to minimize friction, can refactor to Date later if sorting needed.
    }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionEnquiry', admissionEnquirySchema);
