/**
 * One-time helper: grant teachers the `edit_student` permission (e.g. for Student Health PUT).
 * Safe to run multiple times — skips if the mapping already exists.
 *
 * Usage (from veda-backend): node scratch/grantTeacherEditStudentPermission.js
 */
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Role = require("../src/models/Role");
const Permission = require("../src/models/Permission");
const RolePermission = require("../src/models/RolePermission");

async function main() {
  const uri = process.env.db_Connect_String;
  if (!uri) {
    console.error("Missing db_Connect_String in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  try {
    const teacher = await Role.findOne({ name: "teacher" });
    const perm = await Permission.findOne({ name: "edit_student" });
    if (!teacher || !perm) {
      console.error("Role 'teacher' or permission 'edit_student' not found.");
      process.exit(1);
    }
    const exists = await RolePermission.findOne({
      roleId: teacher._id,
      permissionId: perm._id,
    });
    if (exists) {
      console.log("Teacher already has edit_student. Nothing to do.");
    } else {
      await RolePermission.create({
        roleId: teacher._id,
        permissionId: perm._id,
      });
      console.log("Granted edit_student to teacher role.");
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
