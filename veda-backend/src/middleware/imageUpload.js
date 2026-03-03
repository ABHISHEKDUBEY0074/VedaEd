const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const projectRoot = path.resolve(__dirname, "../../");
const uploadsDir = path.join(projectRoot, "public", "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, filename);
    }
});

const imageUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|svg|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png, svg, gif, webp)!'));
        }
    }
});

module.exports = imageUpload;
