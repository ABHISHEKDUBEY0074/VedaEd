const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const RolePermission = require("../models/RolePermission");

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    // 1️⃣ Check email & password exist
    if (!email || !password) {
      console.log("EMAIL OR PASSWORD MISSING");
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).populate("roleId");

    console.log("USER FOUND:", user);

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("PASSWORD WRONG");
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 4️⃣ Get role
    const roleId = user.roleId._id;
    const roleName = user.roleId.name;

    console.log("ROLE:", roleName);

    // 5️⃣ Fetch permissions
    const rolePermissions = await RolePermission
      .find({ roleId })
      .populate("permissionId");

    const permissions = rolePermissions.map(rp => rp.permissionId.name);

    console.log("PERMISSIONS:", permissions);

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: roleName
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    console.log("LOGIN SUCCESS");

    return res.json({
      token,
      role: roleName,
      permissions
    });

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};