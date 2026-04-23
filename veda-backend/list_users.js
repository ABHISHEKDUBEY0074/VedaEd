const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const users = await User.find({}).limit(10).select("name email roleId refId").populate("roleId");
    console.log("Recent 10 Users:", JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

listUsers();
