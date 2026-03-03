const express = require("express");
const router = express.Router();
const institutionController = require("./institutionController");
const imageUpload = require("../../middleware/imageUpload");

// Get current institution setup
router.get("/", institutionController.getInstitution);

// Create/Update institution setup
router.post("/", institutionController.updateInstitution);

// Upload branding assets (Logo and Cover Image)
// We'll use field specific uploads if needed or just a general asset upload.
router.patch("/upload-assets", imageUpload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), institutionController.uploadInstitutionAssets);

module.exports = router;
