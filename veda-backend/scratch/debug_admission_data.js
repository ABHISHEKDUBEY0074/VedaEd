const mongoose = require('mongoose');
const AdmissionApplication = require('../src/modules/admission/admissionApplicationModel');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const total = await AdmissionApplication.countDocuments();
    console.log("Total Applications:", total);

    const problematic = await AdmissionApplication.find({
        "personalInfo.fees": { $in: ["Paid", "paid"] },
        "personalInfo.stdId": { $in: ["", null] }
    });
    console.log("Problematic Students (Fees Paid, No StdId):", problematic.length);
    problematic.forEach(p => {
        console.log(`- ID: ${p.applicationId}, Parents: ${JSON.stringify(p.parents)}`);
    });

    const selectedCount = await AdmissionApplication.countDocuments({
        $or: [
            { applicationStatus: { $in: ["Approved", "approved"] } },
            { documentVerificationStatus: { $in: ["Verified", "verified"] } },
            { "personalInfo.fees": { $in: ["Paid", "paid"] } }
        ]
    });
    console.log("Selected Count (New Query):", selectedCount);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkData();
