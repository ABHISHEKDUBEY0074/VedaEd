const AdmissionApplication = require("./admissionApplicationModel");
const AdmissionStdIdCounter = require("../../models/AdmissionStdIdCounter");

const yearPattern = (year) => new RegExp(`^STD-${year}-(\\d+)$`, "i");

async function ensureCounterInitialized(year) {
  const existing = await AdmissionStdIdCounter.findOne({ year });
  if (existing) return;

  const pattern = yearPattern(year);
  const rows = await AdmissionApplication.find({ "personalInfo.stdId": pattern })
    .select("personalInfo.stdId")
    .lean();

  let maxSeq = 0;
  for (const row of rows) {
    const stdId = String(row.personalInfo?.stdId || "");
    const match = stdId.match(pattern);
    if (match) {
      maxSeq = Math.max(maxSeq, parseInt(match[1], 10));
    }
  }

  try {
    await AdmissionStdIdCounter.create({ year, seq: maxSeq });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
}

async function allocateNextAdmissionStdId() {
  const year = new Date().getFullYear();
  await ensureCounterInitialized(year);
  const counter = await AdmissionStdIdCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true }
  );

  return `STD-${year}-${String(counter.seq).padStart(4, "0")}`;
}

module.exports = { allocateNextAdmissionStdId };
