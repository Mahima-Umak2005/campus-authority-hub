/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
  uploadFile,
  getFiles,
  getDashboardFiles,
  getRepositoryStructure,
  downloadFile,
  updateApprovalStatus,
  deleteFile,
} = require("../controllers/file.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  protect,
  allowRoles("chairman", "principal", "admin", "hod", "faculty"),
  upload.single("file"),
  uploadFile
);

router.get("/", protect, getFiles);

router.get("/dashboard", protect, getDashboardFiles);

router.get("/structure", protect, getRepositoryStructure);

router.get("/download/:id", protect, downloadFile);

router.patch(
  "/:id/approval",
  protect,
  allowRoles("chairman", "principal", "admin"),
  updateApprovalStatus
);

router.delete(
  "/:id",
  protect,
  allowRoles("chairman", "principal", "admin"),
  deleteFile
);

module.exports = router;
