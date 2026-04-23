const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/modules/student/studentModels');
require('dotenv').config();

async function listStudents() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const students = await Student.find({}).limit(5).select("personalInfo.stdId personalInfo.username personalInfo.name");
    console.log("Recent 5 Students:", JSON.stringify(students, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

listStudents();
