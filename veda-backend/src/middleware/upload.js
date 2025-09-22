const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists - use absolute path from project root
const projectRoot = path.resolve(__dirname, "../../");
const uploadsDir = path.join(projectRoot, "public", "uploads");
console.log("Project root:", projectRoot);
console.log("Uploads directory path:", uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory:", uploadsDir);
} else {
  console.log("Uploads directory already exists:", uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Upload destination:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log("Uploading file:", file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log("File filter - Original name:", file.originalname);
    console.log("File filter - MIME type:", file.mimetype);
    
    // Allow PDF, DOC, DOCX files
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    console.log("File filter - Extension check:", extname);
    console.log("File filter - MIME check:", mimetype);

    if (mimetype && extname) {
      console.log("File accepted");
      return cb(null, true);
    } else {
      console.log("File rejected - Only PDF, DOC, and DOCX files are allowed!");
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

module.exports = upload;
