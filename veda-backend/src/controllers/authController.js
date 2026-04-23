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
    let user = await User.findOne({ email }).populate("roleId");

    // Fallback for students: search by Student ID if initial match fails
    if (!user) {
      const Student = require("../modules/student/studentModels");
      const AdmissionApplication = require("../modules/admission/admissionApplicationModel");
      
      // Try finding in SIS Students
      let student = await Student.findOne({
        $or: [
          { "personalInfo.stdId": email },
          { "personalInfo.username": email }
        ]
      });

      // If not in SIS, try finding in Admission Applications (Paid stage)
      if (!student) {
        student = await AdmissionApplication.findOne({
          $or: [
            { "personalInfo.stdId": email },
            { "personalInfo.username": email }
          ]
        });
      }

      if (student) {
        // Find user by refId (which could be the Student ID or Application ID)
        user = await User.findOne({ refId: student._id }).populate("roleId");
        
        // JUST-IN-TIME USER CREATION:
        // If student exists (paid application or SIS) but no User record exists, create one.
        if (!user) {
          console.log(`Just-in-time User creation for student: ${email}`);
          const Role = require("../models/Role");
          const roleDoc = await Role.findOne({ name: 'student' });
          
          if (roleDoc) {
             const personalInfo = student.personalInfo || {};
             const contactInfo = student.contactInfo || {};
             
             user = await User.create({
                name: personalInfo.name || "Student",
                email: contactInfo.email || personalInfo.username || personalInfo.stdId || email,
                password: personalInfo.password || "default123",
                roleId: roleDoc._id,
                refId: student._id,
                status: 'active'
             });
             
             // Populate roleId manually for the immediate login session
             user.roleId = roleDoc;
             console.log("Just-in-time User created successfully");
          }
        }
      }
    }

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
        role: roleName,
        refId: user.refId
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    console.log("LOGIN SUCCESS");

    return res.json({
      token,
      role: roleName,
      permissions,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: roleName,
        refId: user.refId
      }
    });

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};