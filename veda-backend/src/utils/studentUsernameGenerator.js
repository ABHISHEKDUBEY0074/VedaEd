function parseDobInput(rawDob) {
  if (!rawDob) return null;

  if (rawDob instanceof Date && !Number.isNaN(rawDob.getTime())) {
    return rawDob;
  }

  const dobStr = String(rawDob).trim();
  if (!dobStr) return null;

  const isoMatch = dobStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const dmyMatch = dobStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2}|\d{4})$/);
  if (dmyMatch) {
    const [, day, month, yearRaw] = dmyMatch;
    const year = yearRaw.length === 2 ? Number(`20${yearRaw}`) : Number(yearRaw);
    const parsed = new Date(year, Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const fallback = new Date(dobStr);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function formatDobToDDMMYY(rawDob) {
  const parsed = parseDobInput(rawDob);
  if (!parsed) return "";

  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yy = String(parsed.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

function getFirstNamePrefix(name) {
  const firstName = String(name || "").trim().split(/\s+/)[0] || "";
  const normalized = firstName.toLowerCase().replace(/[^a-z]/g, "");
  return normalized.slice(0, 4).padEnd(4, "x");
}

function generateStudentUsernameBase(name, dob) {
  const prefix = getFirstNamePrefix(name);
  const dobPart = formatDobToDDMMYY(dob);
  return `${prefix}${dobPart}`;
}

module.exports = {
  formatDobToDDMMYY,
  generateStudentUsernameBase,
};
