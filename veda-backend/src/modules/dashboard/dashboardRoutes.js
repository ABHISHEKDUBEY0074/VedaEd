const express = require("express");
const dashboardControllers = require("./dashboardController");

const router = express.Router();

router.get("/stats", dashboardControllers.getAdminDashboardStats);
router.get("/master-stats", dashboardControllers.getMasterDashboardStats);


module.exports = router;
