const bcrypt = require("bcrypt");
const Student = require("./studentModels");
const Parent = require("../parents/parentModel");

exports.createStudent = async (req, res) => {
  // console.log(req.body);
  const { personalInfo, parent, curriculum, assignments, exams, reports } =
    req.body;
  try {
    const requiredFields = ["name", "stdId", "class", "section", "rollNo"];

    for (let fields of requiredFields) {
      console.log(fields);
      if (!personalInfo[fields]) {
        return res.status(400).json({
          success: false,
          message: `${fields} is required`,
        });
      }
    }

    const year = new Date().getFullYear();
    const studentCount = await Student.countDocuments();
    const username = `STU${year}${String(studentCount + 1).padStart(3, "0")}`;
    personalInfo.username = username;

    const hashedPassword = await bcrypt.hash(personalInfo.password, 10);
    personalInfo.password = hashedPassword;

    const newStudent = await Student.create({
      personalInfo,
      parent,
      curriculum,
      assignments,
      exams,
      reports,
    });

    // 2. Push student into class
    // await Class.findByIdAndUpdate(classId, {
    //   $push: { students: newStudent._id }
    // });

    // 3. Push student into section
    // await Section.findByIdAndUpdate(sectionId, {
    //   $push: { students: newStudent._id }
    // });

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

    const student = await Student.findById(newStudent._id).populate("parent");

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
    // Fetch all students but exclude password
    const students = await Student.find();

    res.status(200).json({
      success: true,
      count: students.length,
      students: students,
    });
    // console.log(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If password is being updated, hash it
    if (updateData.personalInfo?.password) {
      updateData.personalInfo.password = await bcrypt.hash(
        updateData.personalInfo.password,
        10
      );
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true, // return updated doc
      runValidators: true, // run schema validators
    }).select("-personalInfo.password"); // exclude password in response

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
