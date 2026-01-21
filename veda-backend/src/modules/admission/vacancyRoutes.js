const express = require("express");
const router = express.Router();
const controller = require("./vacancyController");

router.post("/", controller.createVacancy);
router.get("/", controller.getAllVacancies);
router.put("/:id", controller.updateVacancy);
router.delete("/:id", controller.deleteVacancy);

module.exports = router;
