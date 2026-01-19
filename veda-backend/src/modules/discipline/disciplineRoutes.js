const express = require("express");
const router = express.Router();
const disciplineController = require("./disciplineController");

router.post("/", disciplineController.createIncident);
router.get("/", disciplineController.getAllIncidents);
router.get("/:id", disciplineController.getIncidentById);
router.put("/:id", disciplineController.updateIncident);
router.delete("/:id", disciplineController.deleteIncident);

module.exports = router;
