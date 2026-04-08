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

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".doc",
  ".docx",
  ".txt",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Upload destination:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log("Uploading file:", file.originalname);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${sanitizedOriginalName}`;
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
    
    const extension = path.extname(file.originalname).toLowerCase();
    const extname = ALLOWED_EXTENSIONS.has(extension);
    const mimetype = ALLOWED_MIME_TYPES.has(file.mimetype);
    const isGenericMime = !file.mimetype || file.mimetype === "application/octet-stream";

    console.log("File filter - Extension check:", extname);
    console.log("File filter - MIME check:", mimetype);

    if (extname && (mimetype || isGenericMime)) {
      console.log("File accepted");
      return cb(null, true);
    } else {
      console.log("File rejected - Unsupported file type");
      cb(new Error("Unsupported file type. Allowed: PDF, PNG, JPG, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX."));
    }
  }
});

const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      const message = err.name === "MulterError" ? err.message : err.message || "File upload failed";
      return res.status(400).json({ success: false, message });
    }
    return next();
  });
};

module.exports = { upload, uploadSingle, uploadsDir };
