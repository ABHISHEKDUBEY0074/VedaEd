const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Sports", "Academic", "Cultural", "Competition"],
        default: "Sports",
    },
    class: [{
        type: String,
        required: true,
    }],
    section: {
        type: String,
        default: "All",
    },
    date: {
        type: String, // Storing as string to match frontend format YYYY-MM-DD
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    participants: [{
        type: String,
    }],
    teachers: [{
        type: String,
    }],
    notify: {
        admin: { type: Boolean, default: true },
        classTeacher: { type: Boolean, default: true },
        parents: { type: Boolean, default: false },
    },
    outcome: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["Upcoming", "Completed"],
        default: "Upcoming",
    },
    winner: {
        First: {
            name: { type: String, default: "" },
            class: { type: String, default: "" },
            section: { type: String, default: "" },
        },
        Second: {
            name: { type: String, default: "" },
            class: { type: String, default: "" },
            section: { type: String, default: "" },
        },
        Third: {
            name: { type: String, default: "" },
            class: { type: String, default: "" },
            section: { type: String, default: "" },
        },
    },
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
