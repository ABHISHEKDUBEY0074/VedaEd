const express = require("express");
const router = express.Router();
const controller = require("./admissionApplicationController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure this directory exists or 'uploads/' exists
        // The main app.js serves /uploads from ../public/uploads
        // We should probably use that path
        cb(null, path.join(__dirname, "../../../public/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Routes
router.post("/apply", controller.createApplication);
router.post("/upload", upload.single("file"), controller.uploadApplicationDocument);
router.get("/", controller.getAllApplications);
router.get("/:id", controller.getApplicationById);
router.put("/:id/status", controller.updateApplicationStatus);
router.put("/:applicationId/document/:documentId/verify", controller.verifyDocumentStatus);

module.exports = router;
