const bcrypt = require("bcrypt");
const Student = require("./studentModels");
const Parent = require("../parents/parentModel");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const path = require('path');
const fs = require('fs');
const TeacherClass = require('../../models/TeacherClass');
const User = require('../../models/User');
const UPLOADS_DIR = path.resolve(__dirname, "../../../public/uploads");

const safeDocumentPath = (filename) => {
  const normalizedFilename = path.basename(filename);
  return path.join(UPLOADS_DIR, normalizedFilename);
};

exports.createStudent = async (req, res) => {
  console.log("req-body", req.body);
  const { personalInfo, parent, curriculum, assignments, exams, reports, health } =
    req.body;
  try {
    const requiredFields = ["name", "stdId", "class", "section", "rollNo"];
    // class and section as id's aa rhe
    for (let fields of requiredFields) {
      console.log(fields);
      if (!personalInfo[fields]) {
        return res.status(400).json({
          success: false,
          message: `${fields} is required`,
        });
      }
    }
    // Class with that name exists?
    const { class: className, section: sectionName } = req.body.personalInfo;

    const existClass = await Class.findOne({ name: className });
    console.log("existClass", existClass);
    if (!existClass) {
      return res.status(400).json({ message: "Class not found" });
    }

    // Section with that name exists?
    const existSection = await Section.findOne({ name: sectionName }, "name");
    console.log(existSection);
    if (!existSection) {
      return res.status(400).json({ message: "Section not found" });
    }
    //CHECK IF SECTION BELONGS TO THIS CLASS
    if (
      !existClass.sections
        .map((id) => id.toString())
        .includes(existSection._id.toString())
    ) {
      return res
        .status(400)
        .json({ message: "Section does not belong to this class" });
    }
    // Unique login username: derive from Student ID so class/section/roll combos cannot collide.
    const stdIdClean = String(personalInfo.stdId).trim();
    const username = `STD${stdIdClean.replace(/\s+/g, "")}`;
    personalInfo.username = username;

    const duplicate = await Student.findOne({
      $or: [
        { "personalInfo.username": username },
        { "personalInfo.stdId": stdIdClean },
      ],
    })
      .select("_id personalInfo.stdId personalInfo.username")
      .lean();
    if (duplicate) {
      const sameStdId = duplicate.personalInfo?.stdId === stdIdClean;
      return res.status(409).json({
        success: false,
        message: sameStdId
          ? "A student with this Student ID already exists."
          : "A student with this login username already exists.",
      });
    }

    // const plainPassword = personalInfo.password;
    // const hashedPassword = await bcrypt.hash(personalInfo.password, 10);
    // personalInfo.password = hashedPassword;

    const newStudent = await Student.create({
      personalInfo: {
        ...req.body.personalInfo,
        class: existClass._id,
        section: existSection._id,
      },
      parent,
      curriculum,
      assignments,
      exams,
      exams,
      reports,
      health,
    });

    // linking to parents
    if (parent) {
      const parentExists = await Parent.findById(parent);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent not found",
        });
      }
      await Parent.findByIdAndUpdate(parent, {
        $push: { children: newStudent._id },
      });
    }

    const studentDoc = await Student.findById(newStudent._id)
      .populate("parent")
      .populate("personalInfo.class", "name") // only bring class name
      .populate("personalInfo.section", "name"); // only bring section name
    // convert to plain object
    const student = studentDoc.toObject();

    // replace populated objects with just the `name`
    student.personalInfo.class = student.personalInfo.class?.name || null;
    student.personalInfo.section = student.personalInfo.section?.name || null;
    // student.personalInfo.password = plainPassword;
    // console.log("student: ", student);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });

    // Create User record for auth (Background/Post-response)
    try {
      const roleDoc = await require('../../models/Role').findOne({ name: 'student' });
      if (roleDoc) {
        await require('../../models/User').create({
          name: personalInfo.name,
          email: personalInfo.contactDetails?.email || personalInfo.username,
          password: personalInfo.password, // bcrypt hashing is handled by User model pre-save hook
          roleId: roleDoc._id,
          refId: newStudent._id,
          status: 'active'
        });
        console.log("Auth User created for student");
      }
    } catch (err) {
      console.error("Auth User creation failed for student:", err.message);
    }

  } catch (error) {
    console.error("Error creating student:", error);
    if (error.code === 11000) {
      const keys = error.keyPattern ? Object.keys(error.keyPattern) : [];
      const fieldStr = keys.join(", ") || "record";
      return res.status(409).json({
        success: false,
        message: keys.some((k) => k.includes("username"))
          ? "This login username is already in use. Use a different Student ID."
          : `Duplicate ${fieldStr}. This value is already registered.`,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find student by username
    const student = await Student.findOne({
      "personalInfo.username": username,
    });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      student.personalInfo.password
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = {
      personalInfo: student.personalInfo.select("-personalInfo.password"),
      parentInfo,
      curriculum,
      assignments,
      exams,
      reports,
    };
    // Create JWT payload
    const payload = {
      id: student._id,
      role: "student", // helpful for role-based auth later
      username: student.personalInfo.username,
    };

    // Generate JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      student: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET students/
exports.getAllStudents = async (req, res) => {
  try {
    let query = {};

    // 1. Parent Access filtering: JWT userId is User._id; Student.parent is Parent._id (User.refId).
    if (req.user && req.user.role === 'parent') {
      const userDoc = await User.findById(req.user.userId).select("refId").lean();
      if (userDoc?.refId) {
        query = { parent: userDoc.refId };
      } else {
        query = { _id: { $in: [] } };
      }
    }

    // 2. Teacher Access filtering: must only see assigned classes
    if (req.user && req.user.role === 'teacher') {
      const assignedClasses = await TeacherClass.find({ teacherId: req.user.userId }).select('classId');
      const classIds = assignedClasses.map(ac => ac.classId);
      query["personalInfo.class"] = { $in: classIds };
    }

    // 3. User Filter by class/section
    const { class: cls, section: sec, keyword } = req.query;
    if (cls && cls !== "All") {
      const existClass = await Class.findOne({ name: cls });
      if (existClass) query["personalInfo.class"] = existClass._id;
    }
    if (sec && sec !== "All") {
      const existSection = await Section.findOne({ name: sec });
      if (existSection) query["personalInfo.section"] = existSection._id;
    }
    if (keyword) {
      query["personalInfo.name"] = { $regex: keyword, $options: 'i' };
    }

    // Fetch all students based on the filtered query (newest first)
    const studentDocs = await Student.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .populate("personalInfo.class", "name") // only bring class name
      .populate("personalInfo.section", "name"); // only bring section name;

    const students = studentDocs.map(student => {
      const obj = student.toObject();
      obj.personalInfo.class = obj.personalInfo.class?.name || null;
      obj.personalInfo.section = obj.personalInfo.section?.name || null;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Single student profile
exports.getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res.status(404).json({
        success: false,
        message: "ID invalid/missing",
      });

    const studentDoc = await Student.findById(id)
      .populate("personalInfo.class", "name")
      .populate("personalInfo.section", "name")
      .populate("parent", "fatherName motherName contactDetails");
    if (!studentDoc)
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    res.status(200).json({
      success: true,
      student: studentDoc
    })
  } catch (error) {
    console.error("Error Viewing student Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateStudent = async (req, res) => {
  console.log("Full request body:", JSON.stringify(req.body, null, 2));
  console.log("Update request for ID:", req.params.id);
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { class: className, section: sectionName } = req.body.personalInfo || {};
    console.log("Extracted className:", className, "sectionName:", sectionName);

    let existClass = null;
    let existSection = null;

    // Only validate class and section if they are provided in the request
    if (className) {
      console.log("Looking for class with name:", className);
      existClass = await Class.findOne({ name: className });
      console.log("existClass", existClass);
      if (!existClass) {
        return res.status(400).json({ message: "Class not found" });
      }
    } else {
      console.log("No className provided, skipping class validation");
    }

    if (sectionName) {
      console.log("Looking for section with name:", sectionName);
      existSection = await Section.findOne({ name: sectionName }, "name");
      console.log("existSection", existSection);
      if (!existSection) {
        return res.status(400).json({ message: "Section not found" });
      }
    } else {
      console.log("No sectionName provided, skipping section validation");
    }

    // Only validate class-section relationship if both are provided
    if (existClass && existSection) {
      if (
        !existClass.sections
          .map((id) => id.toString())
          .includes(existSection._id.toString())
      ) {
        return res
          .status(400)
          .json({ message: "Section does not belong to this class" });
      }
    }

    // If password is being updated, hash it
    if (updateData.personalInfo?.password) {
      updateData.personalInfo.password = await bcrypt.hash(
        updateData.personalInfo.password,
        10
      );
    }

    // Get the existing student to preserve required fields
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Use $set operator to only update specific fields
    const updateFields = {
      $set: {
        "personalInfo.name": updateData.personalInfo.name,
        "personalInfo.stdId": updateData.personalInfo.stdId,
        "personalInfo.DOB": updateData.personalInfo.DOB,
        "personalInfo.gender": updateData.personalInfo.gender,
        "personalInfo.age": updateData.personalInfo.age,
        "personalInfo.address": updateData.personalInfo.address,
        "personalInfo.contactDetails": updateData.personalInfo.contactDetails,
        "personalInfo.fees": updateData.personalInfo.fees,
        "personalInfo.rollNo": updateData.personalInfo.rollNo,
        "personalInfo.rollNo": updateData.personalInfo.rollNo,
        "personalInfo.bloodGroup": updateData.personalInfo.bloodGroup,
      }
    };

    if (updateData.health) {
      updateFields.$set.health = updateData.health;
    }

    // Only update class and section if they are provided and valid
    if (existClass) {
      updateFields.$set["personalInfo.class"] = existClass._id;
    }
    if (existSection) {
      updateFields.$set["personalInfo.section"] = existSection._id;
    }

    console.log("Existing student class:", existingStudent.personalInfo.class);
    console.log("Existing student section:", existingStudent.personalInfo.section);
    console.log("Existing student username:", existingStudent.personalInfo.username);
    console.log("Username type:", typeof existingStudent.personalInfo.username);
    console.log("Username is null?", existingStudent.personalInfo.username === null);
    console.log("Username is undefined?", existingStudent.personalInfo.username === undefined);
    console.log("Final update data:", JSON.stringify(updateFields, null, 2));

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(id, updateFields, {
      new: true, // return updated doc
      runValidators: true, // run schema validators
    })
      .populate("personalInfo.class", "name") // populate class with name
      .populate("personalInfo.section", "name") // populate section with name
      .select("-personalInfo.password"); // exclude password in response

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    console.log("updatedStudent", updatedStudent);
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });

    // Sync Auth User
    try {
      const user = await require('../../models/User').findOne({ refId: id });
      if (user) {
        user.name = updateData.personalInfo.name || user.name;
        user.email = (updateData.personalInfo.contactDetails?.email || updateData.personalInfo.username) || user.email;
        if (updateData.personalInfo.password) {
          user.password = req.body.personalInfo.password;
        }
        await user.save();
      }
    } catch (err) {
      console.error("Auth User sync failed for student:", err.message);
    }

  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });

    // Cleanup Auth User
    try {
      await require('../../models/User').findOneAndDelete({ refId: id });
    } catch (err) {
      console.error("Auth User cleanup failed for student:", err.message);
    }

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get student statistics
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ "personalInfo.status": "Active" });
    const inactiveStudents = await Student.countDocuments({ "personalInfo.status": "Inactive" });

    // Get students by class
    const studentsByClass = await Student.aggregate([
      {
        $group: {
          _id: "$personalInfo.class",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        studentsByClass
      }
    });
  } catch (error) {
    console.error("Error fetching student stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get student dashboard stats (for mobile/web portal)
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // These would be real counts in a full system
    res.status(200).json({
      success: true,
      stats: {
        assignments: 12, // Placeholder
        attendance: 92, // Placeholder
        exams: 2, // Placeholder
        activities: 4, // Placeholder
      }
    });
  } catch (error) {
    console.error("Error fetching student dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



exports.importStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    }

    const formattedStudents = [];

    for (const stu of students) {
      let classId = null;
      let sectionId = null;

      // 🔹 Try to map Class name → ObjectId
      if (stu.personalInfo.class && stu.personalInfo.class !== "-") {
        const cls = await Class.findOne({ name: stu.personalInfo.class.trim() });
        if (cls) {
          classId = cls._id;
        } else {
          console.warn(`Class not found for: ${stu.personalInfo.class}`);
        }
      }

      // 🔹 Try to map Section name → ObjectId
      if (stu.personalInfo.section && stu.personalInfo.section !== "-") {
        const sec = await Section.findOne({ name: stu.personalInfo.section.trim() });
        if (sec) {
          sectionId = sec._id;
        } else {
          console.warn(`Section not found for: ${stu.personalInfo.section}`);
        }
      }

      formattedStudents.push({
        personalInfo: {
          ...stu.personalInfo,
          class: classId,   // Replace with ObjectId
          section: sectionId, // Replace with ObjectId
        },
        attendance: stu.attendance || "-",
      });
    }

    // Insert after mapping
    const savedStudents = await Student.insertMany(formattedStudents);

    res.status(201).json({
      success: true,
      message: "Students imported successfully",
      students: savedStudents,
    });
  } catch (err) {
    console.error("Error importing students:", err);
    res.status(500).json({
      success: false,
      message: "Import failed",
      error: err.message,
    });
  }
};

exports.uploadDocument = async (req, res) => {
  console.log("req.file from uploaddoc student", req.file);
  console.log("req.body:", req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { studentId } = req.body; // send studentId from frontend
    console.log("Received studentId:", studentId);

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Initialize documents array if it doesn't exist
    if (!student.documents) {
      student.documents = [];
    }

    const documentData = {
      name: req.file.originalname,
      path: fileUrl,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    student.documents.push(documentData);
    await student.save();
    const savedDocument = student.documents[student.documents.length - 1];

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: savedDocument,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all documents for student
exports.getAllDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Getting documents for studentId:", studentId);
    const student = await Student.findById(studentId).select("documents");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json(student.documents || []);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.previewDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = safeDocumentPath(filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = safeDocumentPath(filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { studentId, documentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const targetDocument = student.documents.id(documentId);
    if (!targetDocument) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (targetDocument.path) {
      const filename = path.basename(targetDocument.path);
      const filePath = safeDocumentPath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    student.documents.pull({ _id: documentId });
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};