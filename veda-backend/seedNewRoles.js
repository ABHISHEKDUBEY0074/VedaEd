const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Role = require("./src/models/Role");
const Permission = require("./src/models/Permission");
const RolePermission = require("./src/models/RolePermission");

async function seedNewRoles() {
  await connectDB();

  try {
    const roles = ['hr', 'receptionist', 'admission'];
    const roleDocs = {};
    for (const r of roles) {
      roleDocs[r] = await Role.findOneAndUpdate(
        { name: r },
        { name: r },
        { upsert: true, new: true }
      );
    }

    // Assign some basic perms from current seed
    const allPerms = await Permission.find();
    
    // HR
    const hrPerms = allPerms.filter(p => ['Staff', 'Dashboard'].includes(p.module));
    for (const p of hrPerms) {
      await RolePermission.updateOne({ roleId: roleDocs['hr']._id, permissionId: p._id }, { roleId: roleDocs['hr']._id, permissionId: p._id }, { upsert: true });
    }

    // Receptionist
    const recPerms = allPerms.filter(p => ['Student', 'Dashboard'].includes(p.module));
    for (const p of recPerms) {
      await RolePermission.updateOne({ roleId: roleDocs['receptionist']._id, permissionId: p._id }, { roleId: roleDocs['receptionist']._id, permissionId: p._id }, { upsert: true });
    }

    // Admission
    const admPerms = allPerms.filter(p => ['Student', 'Dashboard'].includes(p.module));
    for (const p of admPerms) {
      await RolePermission.updateOne({ roleId: roleDocs['admission']._id, permissionId: p._id }, { roleId: roleDocs['admission']._id, permissionId: p._id }, { upsert: true });
    }

    console.log("New roles and permissions seeded successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
seedNewRoles();
