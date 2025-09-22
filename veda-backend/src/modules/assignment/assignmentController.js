const Assignment = require("./assignment.js");

exports.createAssignment = async (req, res) => {
  try {
    const { classId, sectionId, subjectId, title, description, assignmentType, dueDate, teacherId } = req.body;

    const assignment = new Assignment({
      class: classId,
      section: sectionId,
      subject: subjectId,
      teacher: teacherId || null, // ek baar student hojaye phir protected royte se ye direct kr denge ki jo bhi loggerd in teacher hai usi ka id yha le lega from auth middleware
      title,
      description,
      assignmentType,
      dueDate,
      document: req.file ? `/uploads/${req.file.filename}` : null, 
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment created successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: "Error creating assignment", error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { status, classId, subjectId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (classId) filter.class = classId;
    if (subjectId) filter.subject = subjectId;

    const assignments = await Assignment.find(filter)
      .populate("class section subject teacher", "name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments", error: err.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("class section subject teacher", "name");

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignment", error: err.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, assignment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Assignment not found" });

    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting assignment", error: err.message });
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const studentClass = req.user.class; // assuming from student login
    const studentSection = req.user.section;

    const assignments = await Assignment.find({
      class: studentClass,
      section: studentSection,
    })
      .populate("subject teacher", "name")
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student assignments", error: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = {
      student: req.user._id,
      file: req.file ? req.file.path : null,
      submittedAt: new Date(),
      status: new Date() > assignment.dueDate ? "Late" : "Submitted",
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.json({ message: "Assignment submitted successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: "Error submitting assignment", error: err.message });
  }
};
