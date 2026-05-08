const mongoose = require("mongoose");
const path = require("path");

const MONGO_URI = "mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms";

const AdmissionApplication = require(path.join(__dirname, "../src/modules/admission/admissionApplicationModel"));
const { generateNextStudentId } = require(path.join(__dirname, "../src/utils/studentIdGenerator"));
const { generateNextParentId } = require(path.join(__dirname, "../src/utils/parentIdGenerator"));

async function fixMissingIds() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const applications = await AdmissionApplication.find({ 
            "personalInfo.fees": "Paid", 
            $or: [
                { "personalInfo.stdId": "" },
                { "personalInfo.stdId": { $exists: false } },
                { "personalInfo.stdId": "MISSING" }
            ]
        });

        console.log(`Found ${applications.length} applications with missing IDs but marked as Paid.`);

        for (const app of applications) {
            console.log(`Fixing: ${app.personalInfo.name} (${app.applicationId})`);
            
            if (!app.personalInfo.stdId || app.personalInfo.stdId === "MISSING") {
                app.personalInfo.stdId = await generateNextStudentId();
            }
            
            if (!app.parents.parentId) {
                app.parents.parentId = await generateNextParentId();
            }

            await app.save();
            console.log(`- Generated StdID: ${app.personalInfo.stdId}, ParentID: ${app.parents.parentId}`);
        }

        console.log("\nFix completed.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixMissingIds();
