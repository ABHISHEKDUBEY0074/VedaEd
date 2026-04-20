const fs = require("fs");
const path = require("path");
const SuperadminLanding = require("./superadminLandingModel");

const uploadsDirectory = path.join(__dirname, "../../../public/uploads");

const sendSuccess = (res, data = {}, message = "Operation successful") =>
  res.status(200).json({
    success: true,
    message,
    data,
  });

const sendError = (res, status, message, error) =>
  res.status(status).json({
    success: false,
    message,
    data: error ? { error: error.message || String(error) } : {},
  });

const SINGLETON_FILTER = { singletonKey: "default" };

const ensureSingletonDocument = async () => {
  const keyMatched = await SuperadminLanding.findOne(SINGLETON_FILTER);
  if (keyMatched) return keyMatched;

  const docs = await SuperadminLanding.find().sort({ createdAt: 1 });
  if (!docs.length) return null;

  const primary = docs[0];
  if (primary.singletonKey !== "default") {
    primary.singletonKey = "default";
    await primary.save({ validateBeforeSave: false });
  }

  if (docs.length > 1) {
    const duplicateIds = docs.slice(1).map((doc) => doc._id);
    await SuperadminLanding.deleteMany({ _id: { $in: duplicateIds } });
  }

  return SuperadminLanding.findOne(SINGLETON_FILTER);
};

exports.getProfile = async (req, res) => {
  try {
    const document = await ensureSingletonDocument();
    return sendSuccess(res, document?.profile || {});
  } catch (error) {
    return sendError(res, 500, "Failed to fetch profile", error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await SuperadminLanding.findOneAndUpdate(
      SINGLETON_FILTER,
      {
        $set: {
          singletonKey: "default",
          profile: req.body || {},
        },
        $setOnInsert: {
          theme: {},
          other: {},
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    const updated = await ensureSingletonDocument();
    return sendSuccess(res, updated?.profile || {});
  } catch (error) {
    return sendError(res, 500, "Failed to update profile", error);
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "Logo file is required");
    }

    const document = await ensureSingletonDocument();
    if (!document) {
      return sendError(
        res,
        400,
        "Profile not found. Save profile before uploading logo."
      );
    }
    const oldLogoPath = document.profile?.logo;
    const newLogoPath = `/uploads/${req.file.filename}`;

    await SuperadminLanding.updateOne(
      { _id: document._id },
      { $set: { "profile.logo": newLogoPath } }
    );

    if (oldLogoPath && oldLogoPath !== newLogoPath) {
      const oldFilename = oldLogoPath.replace(/^\/uploads\//, "");
      const oldAbsolutePath = path.join(uploadsDirectory, oldFilename);
      if (fs.existsSync(oldAbsolutePath)) {
        fs.unlinkSync(oldAbsolutePath);
      }
    }

    const updated = await ensureSingletonDocument();
    return sendSuccess(res, { logo: updated?.profile?.logo || "" });
  } catch (error) {
    return sendError(res, 500, "Failed to upload logo", error);
  }
};

exports.getTheme = async (req, res) => {
  try {
    const document = await ensureSingletonDocument();
    return sendSuccess(res, document?.theme || {});
  } catch (error) {
    return sendError(res, 500, "Failed to fetch theme", error);
  }
};

exports.updateTheme = async (req, res) => {
  try {
    const document = await ensureSingletonDocument();
    if (!document) {
      return sendError(
        res,
        400,
        "Profile not found. Save profile before updating theme."
      );
    }

    await SuperadminLanding.updateOne(
      { _id: document._id },
      { $set: { theme: req.body || {} } }
    );

    const updated = await ensureSingletonDocument();
    return sendSuccess(res, updated?.theme || {});
  } catch (error) {
    return sendError(res, 500, "Failed to update theme", error);
  }
};

exports.getOther = async (req, res) => {
  try {
    const document = await ensureSingletonDocument();
    return sendSuccess(res, document?.other || {});
  } catch (error) {
    return sendError(res, 500, "Failed to fetch other settings", error);
  }
};

exports.updateOther = async (req, res) => {
  try {
    const document = await ensureSingletonDocument();
    if (!document) {
      return sendError(
        res,
        400,
        "Profile not found. Save profile before updating other settings."
      );
    }

    await SuperadminLanding.updateOne(
      { _id: document._id },
      { $set: { other: req.body || {} } }
    );

    const updated = await ensureSingletonDocument();
    return sendSuccess(res, updated?.other || {});
  } catch (error) {
    return sendError(res, 500, "Failed to update other settings", error);
  }
};
