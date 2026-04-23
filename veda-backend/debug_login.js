const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/modules/student/studentModels');

require('dotenv').config();

async function debugStudent() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const searchId = 'STD-2026-0021';
    
    console.log(`Searching for Student with stdId or username containing: ${searchId}`);
    const students = await Student.find({
      $or: [
        { "personalInfo.stdId": searchId },
        { "personalInfo.username": searchId }
      ]
    });
    
    console.log("Students found:", JSON.stringify(students, null, 2));

    if (students.length > 0) {
      const studentId = students[0]._id;
      console.log(`Searching for User with refId: ${studentId}`);
      const users = await User.find({ refId: studentId });
      console.log("Users found:", JSON.stringify(users, null, 2));
    } else {
      console.log("No student found with that ID in Student collection.");
    }

    // Also search User collection by email/username
    const userByEmail = await User.findOne({ email: searchId });
    console.log("User found by email matching searchId:", JSON.stringify(userByEmail, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

debugStudent();
