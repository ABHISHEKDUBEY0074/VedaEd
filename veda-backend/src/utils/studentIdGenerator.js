const StudentIdCounter = require("../models/StudentIdCounter");
const Student = require("../modules/student/studentModels");
const AdmissionApplication = require("../modules/admission/admissionApplicationModel");

const yearPattern = (year) => new RegExp(`^STD-?${year}-?(\\d+)$`, 'i');

async function ensureCounterInitialized(year) {
  const existing = await StudentIdCounter.findOne({ year });
  if (existing) return;

  const pattern = yearPattern(year);
  let maxSeq = 0;

  // We find all records to ensure we get the absolute max sequence
  const students = await Student.find({ "personalInfo.stdId": { $regex: `^STD-?${year}-?` } })
    .select("personalInfo.stdId")
    .lean();
    
  for (const s of students) {
    if (s.personalInfo?.stdId) {
      const match = s.personalInfo.stdId.match(pattern);
      if (match) maxSeq = Math.max(maxSeq, parseInt(match[1], 10));
    }
  }

  const applications = await AdmissionApplication.find({ "personalInfo.stdId": { $regex: `^STD-?${year}-?` } })
    .select("personalInfo.stdId")
    .lean();
    
  for (const a of applications) {
    if (a.personalInfo?.stdId) {
      const match = a.personalInfo.stdId.match(pattern);
      if (match) maxSeq = Math.max(maxSeq, parseInt(match[1], 10));
    }
  }

  try {
    await StudentIdCounter.create({ year, seq: maxSeq });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }
}

/**
 * Generates the next Student ID robustly across the entire system.
 * Format: STD-YYYY-NNNN (e.g. STD-2026-0001)
 */
async function generateNextStudentId() {
  const year = new Date().getFullYear();
  await ensureCounterInitialized(year);
  
  // Atomic increment operation ensures no duplicates
  const doc = await StudentIdCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  const seq = doc.seq;
  return `STD-${year}-${String(seq).padStart(4, "0")}`;
}

async function peekNextStudentId() {
  const year = new Date().getFullYear();
  await ensureCounterInitialized(year);
  const doc = await StudentIdCounter.findOne({ year }).select("seq").lean();
  const nextSeq = (doc?.seq || 0) + 1;
  return `STD-${year}-${String(nextSeq).padStart(4, "0")}`;
}

module.exports = { generateNextStudentId, peekNextStudentId };
