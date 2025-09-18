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

      // console.log("linkedStudentId:", linkedStudentId);
      // console.log("Found students:", students.map(s => s.personalInfo.stdId));

      if (students.length > 0) {
        await Student.updateMany(
          { _id: { $in: students.map(s => s._id) } },
          { $set: { parent: parent._id } }
        );

        parent.children.push(...students.map(s => s._id));
        await parent.save();
      }
    }
    // Fetch parent with populated children
    const newParent = await Parent.findById(parent._id).populate("children");
    // response object (desired fields + unhashed password)
    const data = {
      _id: newParent._id,
      name: newParent.name,
      email: newParent.email,
      phone: newParent.phone,
      parentId: newParent.parentId,
      status: newParent.status,
      children: newParent.children,
      password: password // unhashed password returning
    };
    console.log("Final Parent: ", newParent);
    console.log("data: ", data);

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parent: data
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

exports.getParentbyId = async(req,res)=>{
  const {id} = req.params;
  try{
    if(!id){
      return res.status(404).json({
        success: false,
        message: "ID invalid/missing",
      });
    }

    const parentDoc = await Parent.findById(id).populate("children").lean();
    if (!parentDoc) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }
    
    const data = {
      _id: parentDoc._id,
      name: parentDoc.name,
      email: parentDoc.email,
      phone: parentDoc.phone,
      parentId: parentDoc.parentId,
      status: parentDoc.status,
      password: parentDoc.password, // Include password field
      occupation: parentDoc.occupation,
      relation: parentDoc.relation,
      address: parentDoc.address,
      children: parentDoc.children,
    };
    console.log("data:", data);
    res.status(200).json({
        success:true,
        parent: data
    })

  }catch(error){
    console.error("Error Viewing parent Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

exports.updateParent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID invalid/missing",
      });
    }

    const parentExist = await Parent.findById(id);
    if (!parentExist) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    let unhashedPassword = null;
    if (updateData.password) {
      unhashedPassword = updateData.password; 
      updateData.password = await bcrypt.hash(unhashedPassword, 10); 
    }

    const updatedParent = await Parent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("children")
      .lean();
    // console.log("updatedParent:", updatedParent);

    if (!updatedParent) {
      return res.status(404).json({
        success: false,
        message: "Update failed, parent not found",
      });
    }

    const responseData = {
      _id: updatedParent._id,
      name: updatedParent.name,
      email: updatedParent.email,
      phone: updatedParent.phone,
      parentId: updatedParent.parentId,
      status: updatedParent.status,
      occupation: updatedParent.occupation,
      relation: updatedParent.relation,
      address: updatedParent.address,
      children: updatedParent.children,
      password: unhashedPassword || updatedParent.password, 
    };
    // console.log("responseData:", responseData);

    res.status(200).json({
      success: true,
      parent: responseData,
    });
  } catch (error) {
    console.error("Error Updating parent Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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