const mongoose = require("mongoose");
const path = require("path");

const MONGO_URI = "mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms";

// Use absolute paths to be safe
const AdmissionApplication = require(path.join(__dirname, "../src/modules/admission/admissionApplicationModel"));
const Student = require(path.join(__dirname, "../src/modules/student/studentModels"));

async function checkStudent(name) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const applications = await AdmissionApplication.find({ "personalInfo.name": new RegExp(name, "i") });
        if (applications.length > 0) {
            console.log(`\nFound ${applications.length} applications for "${name}":`);
            applications.forEach(a => {
                console.log(`- ID: ${a._id}, AppID: ${a.applicationId}, Name: ${a.personalInfo.name}, Status: ${a.applicationStatus}, Fees: ${a.personalInfo.fees}, StdID: ${a.personalInfo.stdId || "MISSING"}`);
            });
        } else {
            console.log(`\nNo applications found for "${name}". Recent 5 applications:`);
            const recent = await AdmissionApplication.find().sort({ createdAt: -1 }).limit(5);
            recent.forEach(a => {
                console.log(`- ID: ${a._id}, AppID: ${a.applicationId}, Name: ${a.personalInfo.name}, Status: ${a.applicationStatus}, Fees: ${a.personalInfo.fees}, StdID: ${a.personalInfo.stdId || "MISSING"}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

const name = process.argv[2] || "samikshay";
checkStudent(name);
