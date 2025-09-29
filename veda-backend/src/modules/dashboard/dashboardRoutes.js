const express = require("express");
const  dashboardControllers  = require("./dashboardController");

const router = express.Router();

router.get("/stats", dashboardControllers.getAdminDashboardStats); // admin ka RBAC later add kr de pls in future

module.exports = router;
