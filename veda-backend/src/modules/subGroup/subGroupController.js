const SubjectGroup = require("./subGroupSchema");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Subject = require("../subject/subjectSchema");

exports.createSubjectGroup = async (req, res) => {
  const { name, classes, sections, subjects } = req.body;

  try {
    //  Validate input
    if (!name || !classes || !sections || !subjects) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (name, classes, sections, subjects)",
      });
    }

    // Validate Class
    const classDoc = await Class.findById(classes);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Validate Sections
    const sectionDocs = await Section.find({ _id: { $in: sections } });
    if (sectionDocs.length !== sections.length) {
      return res.status(404).json({
        success: false,
        message: "Some sections not found",
      });
    }

    // Validate Subjects
    const subjectDocs = await Subject.find({ _id: { $in: subjects } });
    if (subjectDocs.length !== subjects.length) {
      return res.status(404).json({
        success: false,
        message: "Some subjects not found",
      });
    }

    // prevent duplicate subject group from creating 
    const existingGroup = await SubjectGroup.findOne({
      classes: classes,
      sections: { $all: sections, $size: sections.length }, // ensure exact match of sections
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "A subject group with the same class, and section(s) already exists",
      });
    }

    //Create Subject Group
    const newSubGroup = await SubjectGroup.create({
      name,
      classes,
      sections,
      subjects,
    });

    // Re-fetch with populated details
    const data = await SubjectGroup.findById(newSubGroup._id)
      .populate("classes", "name")        // get class name
      .populate("sections", "name")       // get section names
      .populate("subjects", "subjectName subjectCode"); // get subject details

    res.status(201).json({
      success: true,
      message: "Subject group created successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getAllSubjectGroups = async (req, res) => {
  try {
    const subjectGroups = await SubjectGroup.find()
      .populate("classes", "name")       // only return class name
      .populate("sections", "name")      // only return section name
      .populate("subjects", "subjectName subjectCode type") // return subject details
      .sort({ createdAt: -1 });

    if (!subjectGroups || subjectGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subject groups found",
      });
    }

    res.status(200).json({
      success: true,
      count: subjectGroups.length,
      data: subjectGroups,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateSubjectGroup = async (req, res) => {
  try {
    const updatedsubjectGroup = await Class.findByIdAndUpdate(req.params.id, { ...req.body }, {
      new: true,
      runValidators: true,
    });

    if (!updatedsubjectGroup) {
      return res.status(404).json({ success: false, message: "Subject Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "SubjectGroup updated successfully",
      data: updatedsubjectGroup,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Update failed", error: err.message });
  }
};

exports.deleteSubjectGroup = async (req, res) => {
  try {
    const deleteSubjectGroup = await Class.findByIdAndDelete(req.params.id);

    if (!deleteSubjectGroup) {
      return res.status(404).json({ success: false, message: "SubjectGroup not found" });
    }

    res.status(200).json({
      success: true,
      message: "SubjectGroup deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};
