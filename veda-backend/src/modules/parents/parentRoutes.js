const express = require('express');
const router = express.Router();
const parentRouter = require("./parentControllers");

router.post("/", parentRouter.createParents);
router.get("/", parentRouter.getAllParents);
router.delete("/:id", parentRouter.deleteParentById);

module.exports = router;