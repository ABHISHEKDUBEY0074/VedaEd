const express = require('express');
const router = express.Router();
const parentRouter = require("./parentControllers");
const { uploadSingle } = require("../../middleware/upload");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, parentRouter.createParents);
router.get("/", authMiddleware, parentRouter.getAllParents);
router.get("/:id", authMiddleware, parentRouter.getParentbyId); // single parent profile view 
router.get("/:id/dashboard-stats", authMiddleware, parentRouter.getParentDashboardStats);
router.put("/:id", authMiddleware, parentRouter.updateParent);
router.delete("/:id", authMiddleware, parentRouter.deleteParentById);

// Document Management
router.post("/upload", authMiddleware, uploadSingle("file"), parentRouter.uploadDocument);
router.get("/documents/:parentId", authMiddleware, parentRouter.getAllDocuments);
router.get("/preview/:filename", authMiddleware, parentRouter.previewDocument);
router.get("/download/:filename", authMiddleware, parentRouter.downloadDocument);
router.delete("/documents/:parentId/:documentId", authMiddleware, parentRouter.deleteDocument);

module.exports = router;