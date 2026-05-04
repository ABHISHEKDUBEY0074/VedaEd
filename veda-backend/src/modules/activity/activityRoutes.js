const express = require("express");
const router = express.Router();
const activityController = require("./activityController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, activityController.getAllActivities);
router.get("/teacher-scope", authMiddleware, activityController.getTeacherActivityScope);
router.post("/", authMiddleware, activityController.createActivity);
router.put("/:id", authMiddleware, activityController.updateActivity);
router.delete("/:id", authMiddleware, activityController.deleteActivity);

module.exports = router;
