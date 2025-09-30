const express = require('express');
const router = express.Router();
const parentRouter = require("./parentControllers");
const upload = require("../../middleware/upload");

router.post("/", parentRouter.createParents);
router.get("/", parentRouter.getAllParents);
router.get("/:id", parentRouter.getParentbyId); // single parent profile view 
router.put("/:id", parentRouter.updateParent);
router.delete("/:id", parentRouter.deleteParentById);

// Document Management
router.post("/upload", upload.single("file"), parentRouter.uploadDocument);
router.get("/documents/:parentId", parentRouter.getAllDocuments);
router.get("/preview/:filename", parentRouter.previewDocument);
router.get("/download/:filename", parentRouter.downloadDocument);

module.exports = router;