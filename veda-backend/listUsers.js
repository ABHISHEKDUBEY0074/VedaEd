const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Role = require("./src/models/Role");

async function listUsers() {
  await connectDB();
  const roles = await Role.find();
  const roleMap = Object.fromEntries(roles.map(r => [r._id.toString(), r.name]));

  const allUsers = await User.find();
  for (const role of Object.values(roleMap)) {
    const user = allUsers.find(u => roleMap[u.roleId.toString()] === role);
    if (user) {
      console.log(`ROLE: ${role} | EMAIL: ${user.email} | NAME: ${user.name}`);
    }
  }
  process.exit();
}
listUsers();
