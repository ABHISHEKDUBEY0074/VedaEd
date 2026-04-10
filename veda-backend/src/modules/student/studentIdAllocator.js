const Student = require("./studentModels");
const StudentIdCounter = require("../../models/StudentIdCounter");

const yearPattern = (year) => new RegExp(`^${year}STD(\\d+)$`);

async function ensureCounterInitialized(year) {
  const existing = await StudentIdCounter.findOne({ year });
  if (existing) return;

  const pattern = yearPattern(year);
  const rows = await Student.find({ "personalInfo.stdId": pattern })
    .select("personalInfo.stdId")
    .lean();

  let maxSeq = 0;
  for (const row of rows) {
    const id = String(row.personalInfo?.stdId || "");
    const m = id.match(pattern);
    if (m) maxSeq = Math.max(maxSeq, parseInt(m[1], 10));
  }

  try {
    await StudentIdCounter.create({ year, seq: maxSeq });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }
}

/**
 * Next display/login id: {year}STD{seq} with seq zero-padded to at least 3 digits.
 */
async function allocateNextStudentStdId() {
  const year = new Date().getFullYear();
  await ensureCounterInitialized(year);
  const doc = await StudentIdCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true }
  );
  const seq = doc.seq;
  const stdId = `${year}STD${String(seq).padStart(4, "0")}`;
  return stdId;
}

async function peekNextStudentStdId() {
  const year = new Date().getFullYear();
  await ensureCounterInitialized(year);
  const doc = await StudentIdCounter.findOne({ year }).select("seq").lean();
  const nextSeq = (doc?.seq || 0) + 1;
  return `${year}STD${String(nextSeq).padStart(4, "0")}`;
}

module.exports = { allocateNextStudentStdId, peekNextStudentStdId };
