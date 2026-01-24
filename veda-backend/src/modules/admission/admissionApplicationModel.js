const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdmissionApplicationSchema = new Schema(
    {
        applicationId: {
            type: String,
            unique: true,
            // We can generate this automatically or let it be flexible
        },
        personalInfo: {
            name: { type: String, required: true, trim: true },
            dateOfBirth: { type: String },
            gender: { type: String },
            bloodGroup: { type: String },
            nationality: { type: String },
            religion: { type: String },
            fees: { type: String, default: "Due" },
        },
        contactInfo: {
            email: { type: String },
            phone: { type: String },
            alternatePhone: { type: String },
            address: { type: String },
            // Note: Frontend concatenates address, city, state, zip. 
            // Ideally we might want to store them separately if we want structured data, 
            // but to match frontend submission exactly for now:
        },
        earlierAcademic: {
            schoolName: { type: String },
            board: { type: String },
            lastClass: { type: String },
            academicYear: { type: String },
        },
        parents: {
            father: {
                name: String,
                occupation: String,
                phone: String,
                email: String,
            },
            mother: {
                name: String,
                occupation: String,
                phone: String,
                email: String,
            },
            guardian: {
                name: String,
                relation: String,
                phone: String,
                email: String,
            },
        },
        emergencyContact: {
            name: String,
            relation: String,
            phone: String,
        },
        transportRequired: { type: String },
        medicalConditions: { type: String },
        specialNeeds: { type: String },

        // Application Status
        applicationStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "pending", "approved", "rejected"],
            default: "Pending",
        },
        // Document Verification Status
        documentVerificationStatus: {
            type: String,
            enum: ["Pending", "Verified", "Rejected", "pending", "verified", "rejected"],
            default: "Pending",
        },
        documents: [
            {
                name: String,
                type: { type: String }, // e.g., 'Passport Size Photo'
                path: String,
                size: Number,
                fileType: String,
                uploadedAt: { type: Date, default: Date.now },
                verificationStatus: { type: String, enum: ["Pending", "Verified", "Rejected", "pending", "verified", "rejected"], default: "Pending" },
                verifiedAt: { type: Date },
                verifiedBy: { type: String },
                comment: { type: String }
            },
        ],
    },
    { timestamps: true }
);

// Auto-generate applicationId
AdmissionApplicationSchema.pre("save", function (next) {
    if (!this.applicationId) {
        this.applicationId = "APP" + Date.now();
    }
    next();
});

module.exports = mongoose.model("AdmissionApplication", AdmissionApplicationSchema);
