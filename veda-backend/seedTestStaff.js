const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Role = require("./src/models/Role");

async function seedTestStaff() {
  await connectDB();

  try {
    const roles = ['hr', 'receptionist', 'admission'];
    const roleDocs = {};
    for (const r of roles) {
      roleDocs[r] = await Role.findOne({ name: r });
    }

    const testUsers = [
      { name: "Hannah HR", email: "hr@veda.com", role: roleDocs['hr'] },
      { name: "Rose Receptionist", email: "frontoffice@veda.com", role: roleDocs['receptionist'] },
      { name: "Adam Admission", email: "admission@veda.com", role: roleDocs['admission'] }
    ];

    for (const tu of testUsers) {
      if (tu.role) {
        await User.findOneAndUpdate(
          { email: tu.email },
          { name: tu.name, email: tu.email, password: "password123", roleId: tu.role._id, status: 'active' },
          { upsert: true, new: true }
        );
      }
    }

    console.log("DEDICATED STAFF TEST ACCOUNTS CREATED:");
    console.log("HR: hr@veda.com / password123");
    console.log("Receptionist: frontoffice@veda.com / password123");
    console.log("Admission: admission@veda.com / password123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedTestStaff();
