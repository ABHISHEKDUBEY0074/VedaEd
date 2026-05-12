const ALLOWED = ["father", "mother", "guardian"];

function hasName(person) {
  return Boolean(person && String(person.name || "").trim());
}

/** Legacy: pick first person with a name (father → mother → guardian). */
function inferParentIdAccountHolder(parents = {}) {
  if (hasName(parents.father)) return "father";
  if (hasName(parents.mother)) return "mother";
  if (hasName(parents.guardian)) return "guardian";
  return "father";
}

function normalizeParentIdAccountHolder(raw, parents = {}) {
  const v = String(raw || "").toLowerCase().trim();
  if (ALLOWED.includes(v)) return v;
  return inferParentIdAccountHolder(parents);
}

function getPersonForHolder(parents = {}, holder) {
  const h = normalizeParentIdAccountHolder(holder, parents);
  if (h === "mother") return parents.mother || {};
  if (h === "guardian") return parents.guardian || {};
  return parents.father || {};
}

/** Returns error message or null if valid. */
function validateParentAccountForHolder(parents = {}, holder) {
  const h = normalizeParentIdAccountHolder(holder, parents);
  const person = getPersonForHolder(parents, h);
  if (!hasName(person)) {
    const label = h === "father" ? "Father" : h === "mother" ? "Mother" : "Guardian";
    return `${label} must have a name to use this account for Parent ID login.`;
  }
  return null;
}

function displayRoleForHolder(parents = {}, holder) {
  const h = normalizeParentIdAccountHolder(holder, parents);
  if (h === "father") return "Father";
  if (h === "mother") return "Mother";
  const rel = String(parents.guardian?.relation || "").trim();
  return rel || "Guardian";
}

module.exports = {
  ALLOWED_PARENT_ID_ACCOUNT_HOLDERS: ALLOWED,
  inferParentIdAccountHolder,
  normalizeParentIdAccountHolder,
  getPersonForHolder,
  validateParentAccountForHolder,
  displayRoleForHolder,
};
