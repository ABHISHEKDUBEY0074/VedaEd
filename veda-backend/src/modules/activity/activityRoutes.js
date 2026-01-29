const express = require("express");
const router = express.Router();
const activityController = require("./activityController");

router.get("/", activityController.getAllActivities);
router.post("/", activityController.createActivity);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
