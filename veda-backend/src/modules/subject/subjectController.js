const Subject = require('./subjectSchema');
const Student = require("../student/studentModels");
const Parent = require("../parents/parentModel");
const Curriculum = require("../curriculum/curriculumModel");


function generatePrefix(name) {
  return name.substring(0, 3).toUpperCase(); // Math -> MATH, English -> ENG
}

// Generate unique subject code
async function generateSubjectCode(name) {
  const prefix = generatePrefix(name);

  // Find last subject with same prefix
  const lastSubject = await Subject.findOne({ subjectCode: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 });

  let newNumber = 101; // start at 101
  if (lastSubject && lastSubject.subjectCode) {
    const match = lastSubject.subjectCode.match(/\d+$/);
    if (match) {
      newNumber = parseInt(match[0]) + 1;
    }
  }

  return `${prefix}${newNumber}`;
}


exports.createSubject = async (req, res) => {
  let { subjectName, type } = req.body;
  try {
    if (!subjectName || !type)
      return res.status(400).json({
        success: false,
        message: "Subject name and type required",
      })

    //Normalize subjectName (trim + collapse spaces)
    subjectName = subjectName.trim().replace(/\s+/g, " ");

    // Check for duplicate (case-insensitive, normalized)
    const existingSubj = await Subject.findOne({
      subjectName: { $regex: new RegExp("^" + subjectName + "$", "i") },
      type,
    });

    if (existingSubj) {
      return res.status(400).json({
        success: false,
        message: "Subject with the same name and type already exists",
      });
    }

    const code = await generateSubjectCode(subjectName);

    const newSubject = await Subject.create({ subjectName, type, subjectCode: code });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: newSubject,
    });

  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid data", error: err.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const { classId, studentId, sectionId } = req.query;
    let targetClassId = classId;
    let targetSectionId = sectionId;

    // RBAC: If student, get their classId and sectionId
    if (req.user && req.user.role === 'student') {
      const student = await Student.findById(req.user.refId).select("personalInfo.class personalInfo.section");
      targetClassId = student?.personalInfo?.class;
      targetSectionId = student?.personalInfo?.section;
    }

    // RBAC: If parent, get their child's classId and sectionId
    if (req.user && req.user.role === 'parent') {
      const parent = await Parent.findById(req.user.refId).populate("children");
      if (studentId) {
        const child = parent.children.find(c => c._id.toString() === studentId);
        targetClassId = child?.personalInfo?.class;
        targetSectionId = child?.personalInfo?.section;
      } else if (parent.children && parent.children.length > 0) {
        targetClassId = parent.children[0]?.personalInfo?.class;
        targetSectionId = parent.children[0]?.personalInfo?.section;
      }
    }

    if (targetClassId) {
      // 1. Check Subject Group for class/section
      let sgQuery = { classes: targetClassId };
      if (targetSectionId) sgQuery.sections = targetSectionId;
      
      const SubjectGroup = require("../subGroup/subGroupSchema");
      const subjectGroup = await SubjectGroup.findOne(sgQuery).populate("subjects");
      
      if (subjectGroup && subjectGroup.subjects && subjectGroup.subjects.length > 0) {
        return res.status(200).json({
          success: true,
          count: subjectGroup.subjects.length,
          data: subjectGroup.subjects,
        });
      }

      // 2. Check Curriculum
      const curriculum = await Curriculum.findOne({ class: targetClassId }).populate("subjects");
      if (curriculum && curriculum.subjects && curriculum.subjects.length > 0) {
        return res.status(200).json({
          success: true,
          count: curriculum.subjects.length,
          data: curriculum.subjects,
        });
      }
      
      // 3. Return empty if requested for specific class but none found (prevents leaking all subjects)
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Default or for staff: return all subjects if no class filter
    const subjects = await Subject.find().sort({ createdAt: -1 });

    if (!subjects || subjects.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, { ...req.body }, {
      new: true,
      runValidators: true,
    });

    if (!updatedSubject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Update failed", error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    console.log("Delete request for Subject ID:", req.params.id);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    console.log("Found subject to delete:", deletedSubject);

    if (!deletedSubject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};