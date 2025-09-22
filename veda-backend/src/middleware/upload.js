const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../public/uploads")
  },
  filename: function (req, file, cb) {
    console.log(req.file);
    cb(null, `${Date.now() + "-" + file.originalname}`);
  }
})

const upload = multer({ storage });
module.exports = upload;
