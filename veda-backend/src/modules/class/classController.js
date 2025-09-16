const Class = require("./classSchema");
const Section = require("../section/sectionSchema");
const Student = require('../student/studentModels');
const Teacher = require("../teacher/teacherModel");
const SubjectGroup = require("../subGroup/subGroupSchema");
const ClassTeacher = require("../assignTeachersToClass/assignTeacherSchema");

// @route   POST /api/classes/
exports.createClass = async (req, res) => {
  console.log("create class backend posted: ", req.body);
  const {name, sections, capacity} = req.body;
  try {
    if(!name || !sections)
      return res.status(400).json({ success: false, message: 'Required Fields Missing' });
    // console.log("hello11");

    //validate Sections 
    if(sections && sections.length> 0){
      const sectionFound = await Section.find({_id:{$in:sections}});
      if(sectionFound.length !== sections.length) 
        return res.status(400).json({ success: false, message: 'Some sections not found' });
    }
    //check if class already exists 
    const isclassExist = await Class.findOne({name});
    if(isclassExist)  
        return res.status(409).json({ success: false, message: 'Class already exists' });

    const newClass = await Class.create({name, sections});
    // console.log("hello1");
   const reply = await Class.findById(newClass._id).populate("sections", "name");
    console.log("hello2");
    
   res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: reply,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// exports.createOrUpdateClass = async (req, res) => {
//   console.log("create/update class backend posted: ", req.body);
//   const { name, sections, capacity } = req.body;

//   try {
//     if (!name || !sections) {
//       return res.status(400).json({ success: false, message: "Required Fields Missing" });
//     }

//     // Validate sections
//     if (sections && sections.length > 0) {
//       const sectionFound = await Section.find({ _id: { $in: sections } });
//       if (sectionFound.length !== sections.length) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Some sections not found" });
//       }
//     }

//     // Check if class already exists
//     let existingClass = await Class.findOne({ name });

//     if (existingClass) {
//       // Merge new sections with old ones (avoid duplicates)
//       const updatedSections = [
//         ...new Set([...existingClass.sections.map(String), ...sections.map(String)]),
//       ];

//       existingClass.sections = updatedSections;
//       if (capacity) existingClass.capacity = capacity; // update capacity if passed

//       await existingClass.save();

//       const reply = await Class.findById(existingClass._id).populate("sections", "name");

//       return res.status(200).json({
//         success: true,
//         message: "Class updated successfully",
//         data: reply,
//       });
//     } else {
//       // Create new class if not found
//       const newClass = await Class.create({ name, sections, capacity });
//       const reply = await Class.findById(newClass._id).populate("sections", "name");

//       return res.status(201).json({
//         success: true,
//         message: "Class created successfully",
//         data: reply,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };


// @desc    Get all classes
// @route   GET /api/classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate('sections', 'name')

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Get single class by ID
// @route   GET /api/classes/:id
// exports.getClassById = async (req, res) => {
//   const {id}= req.params;
//   try {
//       // .populate('sections', 'name')  
//       // .populate("classTeacher", "name email")
//       // .populate("students", "name rollNumber gender")
//       // .populate("subjects", "name code")
//       // .populate("Schedule");
//     if (!id) {
//       return res.status(404).json({ success: false, message: "Class not found" });
//     }

//     const classData = await Class.findById(id).populate("sections");
//     const students = await Student.find({class: id}).select("personalInfo.rollno personalInfo.name personalInfo.gender");
//     const subGroups = await SubjectGroup.find({class: id}).populate("subjects", "subjectName, subjectCode");
// //  TODO: Get teachers assigned to this class
//     const teachers = await ClassTeacher.find({class:id}).populate("teachers", )

//     res.status(200).json({ 
//       success: true, 
//       class: classData,
//       students, 

//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error", error: err.message });
//   }
// };


// @desc    Update class
// @route   PUT /api/classes/:id
// exports.updateClass = async (req, res) => {
//   try {
//     const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedClass) {
//       return res.status(404).json({ success: false, message: "Class not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Class updated successfully",
//       data: updatedClass,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: "Update failed", error: err.message });
//   }
// };

// @desc    Delete class
// @route   DELETE /api/classes/:id
// exports.deleteClass = async (req, res) => {
//   try {
//     const deletedClass = await Class.findByIdAndDelete(req.params.id);

//     if (!deletedClass) {
//       return res.status(404).json({ success: false, message: "Class not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Class deleted successfully",
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Delete failed", error: err.message });
//   }
// };
