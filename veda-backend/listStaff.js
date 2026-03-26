const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Role = require("./src/models/Role");

async function listStaffUsers() {
  await connectDB();
  const roles = await Role.find({ name: { $in: ['hr', 'receptionist', 'admission', 'staff'] } });
  const roleMap = Object.fromEntries(roles.map(r => [r._id.toString(), r.name]));
  
  const users = await User.find({ roleId: { $in: roles.map(r => r._id) } });
  console.log("\n--- STAFF LOGIN CREDENTIALS ---\n");
  for (const u of users) {
    const rName = roleMap[u.roleId.toString()];
    console.log(`Role: ${rName.toUpperCase()} | Email: ${u.email} | Name: ${u.name}`);
  }
  process.exit();
}
listStaffUsers();
