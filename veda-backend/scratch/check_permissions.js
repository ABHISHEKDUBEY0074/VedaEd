const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Role = require('../src/models/Role');
const RolePermission = require('../src/models/RolePermission');
const Permission = require('../src/models/Permission');

async function checkPermissions() {
  try {
    const uri = process.env.db_Connect_String;
    await mongoose.connect(uri);
    console.log("Connected to DB");

    const roleName = 'student';
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      console.log("Role 'student' not found");
      return;
    }
    console.log("Role ID:", role._id);

    const rolePermissions = await RolePermission.find({ roleId: role._id }).populate('permissionId');
    console.log("Permissions for 'student':", rolePermissions.map(rp => rp.permissionId?.name));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkPermissions();
