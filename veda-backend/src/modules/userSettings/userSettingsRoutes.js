const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userSettingsController = require('./userSettingsController');
const authMiddleware = require('../../middleware/authMiddleware');

const uploadDirectory = path.join(__dirname, '../../../public/uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const baseName = path
      .basename(file.originalname || 'avatar', ext)
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '');
    cb(null, `avatar-${Date.now()}-${baseName}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype.toLowerCase());

  if (extValid && mimeValid) {
    return cb(null, true);
  }
  return cb(new Error('Only image files (JPG, PNG, GIF, WebP) are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFileFilter,
});

// Get all user settings
router.get('/', authMiddleware, userSettingsController.getUserSettings);

// Get user profile
router.get('/profile', authMiddleware, userSettingsController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userSettingsController.updateProfile);

// Upload profile avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), userSettingsController.uploadAvatar);

// Update preferences
router.put('/preferences', authMiddleware, userSettingsController.updatePreferences);

// Update notification settings
router.put('/notifications', authMiddleware, userSettingsController.updateNotifications);

// Update security settings
router.put('/security', authMiddleware, userSettingsController.updateSecuritySettings);

module.exports = router;
