const express = require("express");
const router = express.Router();
const classController = require("./classController");

// CRUD Routes for Classes
router.get("/", classController.getClasses);        // GET all classes
// router.get("/:id", classController.getClassById);   // GET class by id
router.post("/", classController.createClass);      // POST new class
// router.put("/:id", classController.updateClass);    // PUT update class
// router.delete("/:id", classController.deleteClass); // DELETE class

module.exports = router;
