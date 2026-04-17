const REQUIRED_FIELDS = [
  "schoolName",
  "udise",
  "sessionStart",
  "sessionEnd",
  "street",
  "state",
  "city",
  "pin",
];

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidWebsite = (value) =>
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(value);

exports.validateProfilePayload = (req, res, next) => {
  const payload = req.body || {};
  const errors = {};

  for (const field of REQUIRED_FIELDS) {
    const value = payload[field];
    if (value === undefined || value === null || String(value).trim() === "") {
      errors[field] = `${field} is required`;
    }
  }

  if (payload.principalEmail && !isValidEmail(String(payload.principalEmail))) {
    errors.principalEmail = "principalEmail must be a valid email";
  }

  if (payload.email && !isValidEmail(String(payload.email))) {
    errors.email = "email must be a valid email";
  }

  if (payload.website && !isValidWebsite(String(payload.website))) {
    errors.website = "website must be a valid URL";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: errors,
    });
  }

  return next();
};
