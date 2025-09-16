const Parent = require("./parentModel");
const bcrypt = require("bcrypt");
const Student = require("../student/studentModels");

exports.createParents = async (req, res) => {
  const { name, email, phone, parentId, linkedStudentId = [], status, password } = req.body;

  try {
    // 🔹 Validate required fields
    if (!email || !name || !phone || !password || !parentId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create parent (without linkedStudentId — only real children will be stored)
    const parent = await Parent.create({
      name,
      email,
      phone,
      parentId,
      password: hashedPassword,
      status,
      children: [] // will push actual student IDs below
    });

    // 🔹 If linkedStudentId provided → find matching students and link them
      if (linkedStudentId.length > 0) {
      const students = await Student.find({
        "personalInfo.stdId": { $in: linkedStudentId },
      });

      console.log("linkedStudentId:", linkedStudentId);
      console.log("Found students:", students.map(s => s.personalInfo.stdId));

      if (students.length > 0) {
        await Student.updateMany(
          { _id: { $in: students.map(s => s._id) } },
          { $set: { parent: parent._id } }
        );

        parent.children.push(...students.map(s => s._id));
        await parent.save();
      }
    }
    // 🔹 Fetch parent with populated children
    const newParent = await Parent.findById(parent._id).populate("children");
    
    console.log("Final Parent: ", newParent);
    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parent: newParent,
    });
  } catch (error) {
    console.log("Error creating parent:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllParents = async(req,res)=>{
  try{
  const parentlIst = await Parent.find();

  res.status(200).json({
      success: true,
      parents:parentlIst,
    });
  }catch (error) {
    console.error("Error fetching parents:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.deleteParentById= async (req, res) => {
  try {
    const { id } = req.params;

    const deletedParent = await Parent.findByIdAndDelete(id);

    if (!deletedParent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent deleted successfully",
      deletedParent,
    });
  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting parent",
    });
  }
};