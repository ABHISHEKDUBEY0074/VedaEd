const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

async function resetStudentPassword() {
  await connectDB();
  const email = "bablu@gmail.com";
  const user = await User.findOne({ email });
  if (user) {
    user.password = "password123";
    await user.save();
    console.log(`Password reset for ${email} successfully!`);
  } else {
    console.log(`User ${email} not found.`);
  }
  process.exit();
}
resetStudentPassword();
