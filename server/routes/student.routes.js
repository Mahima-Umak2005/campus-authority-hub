/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { uploadStudentsCSV } = require("../controllers/student.controller");
const protect = require("../middleware/auth.middleware");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `students-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
});

router.post("/upload-csv", protect, upload.single("csvFile"), uploadStudentsCSV);

module.exports = router;
