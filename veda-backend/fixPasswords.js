const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

async function forceHashPasswords() {
  await connectDB();

  try {
    const users = await User.find();
    console.log(`Checking ${users.length} users...`);

    for (const u of users) {
      if (u.password.length < 30 || !u.password.startsWith('$2')) {
        console.log(`Manually hashing password for: ${u.email}`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(u.password, salt);
        
        // Use findOneAndUpdate to BYPASS the pre-save hook and put the hash in directly
        await User.findOneAndUpdate({ _id: u._id }, { $set: { password: hash } });
      }
    }

    console.log("All passwords are now hashed according to bcrypt standards.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

forceHashPasswords();
