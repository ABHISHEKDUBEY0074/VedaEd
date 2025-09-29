const express = require("express");
const router = express.Router();
const classController = require("./classController");

// CRUD Routes for Classes
router.get("/", classController.getClasses);        // GET all classes
router.get("/:id", classController.getClassById ); // use it to display the list on Ui jaha class cards ke form me show ho rha, proper class teacher and sections isme mil jayega 
router.get("/:classId/sections/:sectionId", classController.getClassByIdAndSection);   // GET class by id and section
router.post("/", classController.createClass);      // POST new class
router.put("/:id", classController.updateClass);    // PUT update class
router.delete("/:id", classController.deleteClass); // DELETE class

module.exports = router;
