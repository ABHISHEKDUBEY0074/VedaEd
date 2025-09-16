const SubjectGroup = require("./subGroupSchema");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Subject = require("../subject/subjectSchema");

exports.createSubjectGroup = async (req, res) => {
  const { name, classes, sections, subjects } = req.body;

  try {
    // Step 1: Validate input
    if (!name || !classes || !sections || !subjects) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (name, classes, sections, subjects)",
      });
    }

    // Step 2: Validate Class
    const classDoc = await Class.findById(classes);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Step 3: Validate Sections
    const sectionDocs = await Section.find({ _id: { $in: sections } });
    if (sectionDocs.length !== sections.length) {
      return res.status(404).json({
        success: false,
        message: "Some sections not found",
      });
    }

    // Step 4: Validate Subjects
    const subjectDocs = await Subject.find({ _id: { $in: subjects } });
    if (subjectDocs.length !== subjects.length) {
      return res.status(404).json({
        success: false,
        message: "Some subjects not found",
      });
    }

    // Step 5: Create Subject Group
    const newSubGroup = await SubjectGroup.create({
      name,
      classes,
      sections,
      subjects,
    });

    // Step 6: Re-fetch with populated details
    const data = await SubjectGroup.findById(newSubGroup._id)
      .populate("classes", "name")        // get class name
      .populate("sections", "name")       // get section names
      .populate("subjects", "subjectName subjectCode"); // get subject details

    // Step 7: Respond
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
// export const allSubjectGroup= async(req,res)=>{

// };