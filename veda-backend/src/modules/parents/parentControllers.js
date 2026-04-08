const Parent = require("./parentModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const Student = require("../student/studentModels");
const UPLOADS_DIR = path.resolve(__dirname, "../../../public/uploads");

const safeDocumentPath = (filename) => {
  const normalizedFilename = path.basename(filename);
  return path.join(UPLOADS_DIR, normalizedFilename);
};

exports.createParents = async (req, res) => {
  const { name, email, phone, parentId, linkedStudentId = [], status, password } = req.body;

  try {
    if (!email || !name || !phone || !password || !parentId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Creating parent (without linkedStudentId — only real children will be stored)
    const parent = await Parent.create({
      name,
      email,
      phone,
      parentId,
      password,
      status,
      children: [] // will push actual student IDs below
    });

    // If linkedStudentId provided → find matching students and link them
    if (linkedStudentId.length > 0) {
      console.log("Looking for students with IDs:", linkedStudentId);
      const students = await Student.find({
        "personalInfo.stdId": { $in: linkedStudentId },
      });
      console.log("Found students:", students);

      if (students.length > 0) {
        await Student.updateMany(
          { _id: { $in: students.map(s => s._id) } },
          { $set: { parent: parent._id } }
        );

        parent.children.push(...students.map(s => s._id));
        await parent.save();
        console.log("Linked students to parent:", parent.children);
      } else {
        console.log("No students found with provided stdIds:", linkedStudentId);
      }
    }
    // Fetch parent with populated children
    const newParent = await Parent.findById(parent._id).populate("children", 'personalInfo.stdId');
    console.log("Populated newParent:", JSON.stringify(newParent, null, 2));

    // response object (desired fields + unhashed password)
    const data = {
      _id: newParent._id,
      name: newParent.name,
      email: newParent.email,
      phone: newParent.phone,
      parentId: newParent.parentId,
      status: newParent.status,
      children: newParent.children && newParent.children.length > 0 ? newParent.children.map(child => ({
        stdId: child.personalInfo?.stdId // pick only stdId
      })) : [],
      password: password // unhashed password returning
    };
    console.log("Final response data:", JSON.stringify(data, null, 2));

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parent: data
    });

    // Create User record for auth
    try {
      const roleDoc = await require('../../models/Role').findOne({ name: 'parent' });
      if (roleDoc) {
        await require('../../models/User').create({
          name: name,
          email: email,
          password: password, // bcrypt hashing is handled by User model pre-save hook
          roleId: roleDoc._id,
          refId: parent._id,
          status: 'active'
        });
        console.log("Auth User created for parent");
      }
    } catch (err) {
      console.error("Auth User creation failed for parent:", err.message);
    }

  } catch (error) {
    console.log("Error creating parent:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllParents = async (req, res) => {
  try {
    const parentList = await Parent.find().populate("children", "personalInfo.stdId");
    console.log("Raw parentList from DB:", JSON.stringify(parentList, null, 2));

    const formattedParents = parentList.map(parent => ({
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      parentId: parent.parentId,
      status: parent.status,
      children: parent.children.length > 0 ? parent.children.map(child => ({
        stdId: child.personalInfo?.stdId
      })) : []
    }));
    console.log("formattedParents", formattedParents);

    res.status(200).json({
      success: true,
      parents: formattedParents,
    });
  } catch (error) {
    console.error("Error fetching parents:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.getParentbyId = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
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
      success: true,
      parent: data
    })

  } catch (error) {
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

    // Sync Auth User
    try {
      const user = await require('../../models/User').findOne({ refId: id });
      if (user) {
        user.name = updateData.name || user.name;
        user.email = updateData.email || user.email;
        if (updateData.password) {
          user.password = req.body.password;
        }
        await user.save();
      }
    } catch (err) {
      console.error("Auth User sync failed for parent:", err.message);
    }

  } catch (error) {
    console.error("Error Updating parent Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteParentById = async (req, res) => {
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

    // Cleanup Auth User
    try {
      await require('../../models/User').findOneAndDelete({ refId: id });
    } catch (err) {
      console.error("Auth User cleanup failed for parent:", err.message);
    }

  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting parent",
    });
  }
};

// Document upload for parent
exports.uploadDocument = async (req, res) => {
  console.log("req.file from uploaddoc parent", req.file);
  console.log("req.body:", req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { parentId } = req.body; // send parentId from frontend
    console.log("Received parentId:", parentId);

    if (!parentId) {
      return res.status(400).json({ success: false, message: "Parent ID is required" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    // Initialize documents array if it doesn't exist
    if (!parent.documents) {
      parent.documents = [];
    }

    const documentData = {
      name: req.file.originalname,
      path: fileUrl,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    parent.documents.push(documentData);
    await parent.save();
    const savedDocument = parent.documents[parent.documents.length - 1];

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

// Get all documents for parent
exports.getAllDocuments = async (req, res) => {
  try {
    const { parentId } = req.params;
    console.log("Getting documents for parentId:", parentId);
    const parent = await Parent.findById(parentId).select("documents");

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    res.status(200).json(parent.documents || []);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Preview document for parent
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

// Download document for parent
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
    const { parentId, documentId } = req.params;
    const parent = await Parent.findById(parentId);

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    const targetDocument = parent.documents.id(documentId);
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

    parent.documents.pull({ _id: documentId });
    await parent.save();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getParentDashboardStats = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findById(id).populate("children");

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    res.status(200).json({
      success: true,
      stats: {
        childrenCount: parent.children ? parent.children.length : 0,
        totalFees: 0,
        pendingFees: 12000,
        attendanceAverage: 93.5,
        upcomingPTA: "15 Oct",
      },
    });
  } catch (error) {
    console.error("Error fetching parent dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};