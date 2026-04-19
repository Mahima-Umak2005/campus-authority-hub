/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadFile,
  getFiles,
  getDashboardFiles,
  getRepositoryStructure,
  downloadFile,
} = require("../controllers/file.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadFile);

router.get("/", getFiles);

router.get("/dashboard", getDashboardFiles);

router.get("/structure", getRepositoryStructure);

router.get("/download/:id", downloadFile);

module.exports = router;
