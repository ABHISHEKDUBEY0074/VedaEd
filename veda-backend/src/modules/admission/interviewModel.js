const mongoose = require("mongoose");
const { Schema } = mongoose;

const InterviewSchema = new Schema(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: "AdmissionApplication",
            required: true,
        },
        interviewDate: {
            type: Date,
        },
        interviewTime: {
            type: String,
        },
        duration: {
            type: String,
        },
        interviewer: {
            type: String,
        },
        venue: {
            type: String,
        },
        type: {
            type: String,
            enum: ["Student + Parent", "Student Only", "Parent Only", "Direct Entry"],
            default: "Student + Parent",
        },
        status: {
            type: String,
            enum: ["Pending", "Scheduled", "Completed"],
            default: "Pending",
        },
        attendance: {
            type: String,
            enum: ["Pending", "Present", "Absent", "Late"],
            default: "Pending",
        },
        result: {
            type: String,
            enum: ["Not Declared", "Qualified", "Disqualified"],
            default: "Not Declared",
        },
        remarks: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", InterviewSchema);
