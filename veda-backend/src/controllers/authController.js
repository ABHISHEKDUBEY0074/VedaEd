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

    // Fallback logic if user not found by email
    if (!user) {
      const isParentID = email.startsWith("PRN-");
      const isStudentID = email.startsWith("STD-");

      const Role = require("../models/Role");
      const Student = require("../modules/student/studentModels");
      const Parent = require("../modules/parents/parentModel");
      const AdmissionApplication = require("../modules/admission/admissionApplicationModel");

      if (isStudentID || (!isParentID && !isStudentID)) {
        // --- STUDENT FALLBACK ---
        let student = await Student.findOne({
          $or: [{ "personalInfo.stdId": email }, { "personalInfo.username": email }]
        });

        if (!student) {
          student = await AdmissionApplication.findOne({
            $or: [{ "personalInfo.stdId": email }, { "personalInfo.username": email }]
          });
        }

        if (student) {
          const studentRole = await Role.findOne({ name: 'student' });
          if (studentRole) {
            user = await User.findOne({ refId: student._id, roleId: studentRole._id }).populate("roleId");
            
            if (!user) {
              console.log(`Just-in-time student user creation: ${email}`);
              user = await User.create({
                name: student.personalInfo?.name || "Student",
                email: student.contactInfo?.email || student.personalInfo?.username || student.personalInfo?.stdId || email,
                password: student.personalInfo?.password || "default123",
                roleId: studentRole._id,
                refId: student._id,
                status: 'active'
              });
              user.roleId = studentRole;
            }
          }
        }
      }

      if (!user && (isParentID || (!isParentID && !isStudentID))) {
        // --- PARENT FALLBACK ---
        let parent = await Parent.findOne({ parentId: email });
        let application = null;

        if (!parent) {
          // Check AdmissionApplication by parentId
          application = await AdmissionApplication.findOne({ "parents.parentId": email });

          // If not found by parentId, try matching generated PRN-ADM- or PRN-SIS- pattern
          if (!application && isParentID) {
            const shortId = email.split("-").pop().toLowerCase();
            if (email.startsWith("PRN-SIS-")) {
              const allParents = await Parent.find({}).select("_id").lean();
              const matchingParent = allParents.find(p => p._id.toString().toLowerCase().endsWith(shortId));
              if (matchingParent) parent = await Parent.findById(matchingParent._id);
            } else if (email.startsWith("PRN-ADM-")) {
              const allApps = await AdmissionApplication.find({}).select("_id").lean();
              const matchingApp = allApps.find(app => app._id.toString().toLowerCase().endsWith(shortId));
              if (matchingApp) application = await AdmissionApplication.findById(matchingApp._id);
            }
          }
        }

        const parentRole = await Role.findOne({ name: 'parent' });
        if (parentRole) {
          const refId = parent?._id || application?._id;
          if (refId) {
            user = await User.findOne({ refId, roleId: parentRole._id }).populate("roleId");

            if (!user) {
              console.log(`Just-in-time parent user creation: ${email}`);
              user = await User.create({
                name: parent?.name || application?.parents?.father?.name || application?.parents?.mother?.name || "Parent",
                email: email,
                password: parent?.password || "default123",
                roleId: parentRole._id,
                refId: refId,
                status: 'active'
              });
              user.roleId = parentRole;
            }
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