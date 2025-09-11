const Timetable = require("./timeTableSchema");
const AssignTeacher = require("../assignTeachersToClass/assignTeacherSchema");
const SubjectGroup = require("../subGroup/subGroupSchema");
const Staff = require("../staff/staffModels");
const Class = require("../class/classSchema");
const Section = require("../section/sectionSchema");
const Subject = require("../subject/subjectSchema");

// helpers
const toMin = (hhmm) => {
  const [h, m] = (hhmm || "").split(":").map(Number);
  return h * 60 + m;
};
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  Math.max(aStart, bStart) < Math.min(aEnd, bEnd); // true if intervals overlap

// CREATE one period
exports.createTimetableEntry = async (req, res) => {
  console.log(req.body);
  try {
    const {
      classId,
      sectionId,
      subjectGroupId,
      day,
      subjectId,
      teacherId,
      timeFrom,
      timeTo,
      roomNo,
    } = req.body;

    // 1) basic validation
    if (
      !classId || !sectionId || !subjectGroupId || !day ||
      !subjectId || !teacherId || !timeFrom || !timeTo
    ) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    if (toMin(timeFrom) >= toMin(timeTo)) {
      return res.status(400).json({ success: false, message: "timeFrom must be earlier than timeTo" });
    }

    // 2) existence checks (optional but nice)
    // const [cls, sec, subj, teacher] = await Promise.all([
    //   Class.findById(classId),
    //   Section.findById(sectionId),
    //   Subject.findById(subjectId),
    //   Staff.findById(teacherId),
    // ]);
    // if (!cls) return res.status(404).json({ success: false, message: "Class not found" });
    // if (!sec) return res.status(404).json({ success: false, message: "Section not found" });
    // if (!subj) return res.status(404).json({ success: false, message: "Subject not found" });
    // if (!teacher) return res.status(404).json({ success: false, message: "Teacher (staff) not found" });
    // if (teacher.personalInfo?.role !== "Teacher") {
    //   return res.status(400).json({ success: false, message: "Selected staff is not a Teacher" });
    // }

    // 3) validate subject group ↔ class/section/subject
    const group = await SubjectGroup.findById(subjectGroupId);
    if (!group) return res.status(404).json({ success: false, message: "Subject Group not found" });

    // group.classes is a single Class ref; sections is an array; subjects is an array
    if (String(group.classes) !== String(classId)) {
      return res.status(400).json({ success: false, message: "Subject Group does not belong to this Class" });
    }
    if (!group.sections.map(String).includes(String(sectionId))) {
      return res.status(400).json({ success: false, message: "Section is not part of this Subject Group" });
    }
    if (!group.subjects.map(String).includes(String(subjectId))) {
      return res.status(400).json({ success: false, message: "Subject is not in this Subject Group" });
    }

    // 4) validate teacher is assigned to class+section
    const assignment = await AssignTeacher.findOne({ class: classId, section: sectionId });
    if (!assignment) {
      return res.status(400).json({ success: false, message: "No teachers assigned for this class & section" });
    }
    if (!assignment.teachers.map(String).includes(String(teacherId))) {
      return res.status(400).json({ success: false, message: "Teacher is not assigned to this class & section" });
    }

    // 5) clash checks
    const start = toMin(timeFrom), end = toMin(timeTo);

    // (a) class+section clash on same day
    const classClashes = await Timetable.find({ class: classId, section: sectionId, day });
    const hasClassClash = classClashes.some(tt =>
      overlaps(start, end, toMin(tt.timeFrom), toMin(tt.timeTo))
    );
    if (hasClassClash) {
      return res.status(409).json({ success: false, message: "Time overlaps with another period for this class/section" });
    }

    // (b) teacher clash on same day
    const teacherClashes = await Timetable.find({ teacher: teacherId, day });
    const hasTeacherClash = teacherClashes.some(tt =>
      overlaps(start, end, toMin(tt.timeFrom), toMin(tt.timeTo))
    );
    if (hasTeacherClash) {
      return res.status(409).json({ success: false, message: "Teacher has another class at this time" });
    }

    // 6) create
    const created = await Timetable.create({
      class: classId,
      section: sectionId,
      subjectGroup: subjectGroupId,
      day,
      subject: subjectId,
      teacher: teacherId,
      timeFrom,
      timeTo,
      roomNo,
    });
    console.log("created Class: ", created);
    const populated = await Timetable.findById(created._id)
      .populate("class", "name")
      .populate("section", "name")
      .populate("subjectGroup", "name")
      .populate("subject", "subjectName subjectCode type")
      .populate("teacher", "personalInfo.name personalInfo.staffId");

    res.status(201).json({ success: true, message: "Timetable entry created", data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// exports.createTimetableEntry = async (req, res) => {
//   try {
//     const { classId, sectionId, day, subjectId, teacherId, timeFrom, timeTo, roomNo } = req.body;

//     if (!classId || !sectionId || !day || !subjectId || !teacherId || !timeFrom || !timeTo) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // check teacher is assigned to that class+section
//     const assigned = await AssignTeacher.findOne({ class: classId, section: sectionId });
//     if (!assigned || !assigned.teachers.includes(teacherId)) {
//       return res.status(400).json({ success: false, message: "Teacher not assigned to this class/section" });
//     }

//     const newEntry = await Timetable.create({
//       class: classId,
//       section: sectionId,
//       day,
//       subject: subjectId,
//       teacher: teacherId,
//       timeFrom,
//       timeTo,
//       roomNo
//     });

//     res.status(201).json({ success: true, message: "Timetable entry created", data: newEntry });

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };
