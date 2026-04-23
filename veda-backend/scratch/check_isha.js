const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../src/models/User');
const Student = require('../src/modules/student/studentModels');
const AdmissionApplication = require('../src/modules/admission/admissionApplicationModel');

async function checkStudent() {
  try {
    const uri = process.env.db_Connect_String;
    await mongoose.connect(uri);
    console.log("Connected to DB");

    const id = "69e61ae6cb064cf6baa87de8";
    const student = await Student.findById(id);
    console.log("Student findById:", student ? "Found" : "Not Found");

    const admission = await AdmissionApplication.findById(id);
    console.log("Admission findById:", admission ? "Found" : "Not Found");
    
    if (admission) {
        console.log("Admission Name:", admission.personalInfo?.name);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkStudent();
