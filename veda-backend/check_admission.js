const mongoose = require('mongoose');
const AdmissionApplication = require('./src/modules/admission/admissionApplicationModel');
require('dotenv').config();

async function checkAdmission() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const searchId = 'STD-2026-0021';
    const apps = await AdmissionApplication.find({
      $or: [
        { "personalInfo.stdId": searchId },
        { "personalInfo.username": searchId }
      ]
    });
    
    console.log("Admission Applications found:", JSON.stringify(apps, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkAdmission();
