/** @format */

const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createPoster,
  getActivePosters,
  deletePoster,
  updatePoster,
  getDashboardPosters,
  getStudentNotices,
  getDepartmentPosters,
  markPosterAsRead,
} = require("../controllers/poster.controller");

// Create Poster
router.post(
  "/",
  protect,
  allowRoles("chairman", "principal", "hod", "faculty"),
  upload.single("poster"),
  createPoster,
);

// Get Active Posters (Public for Display Screen)
router.get("/active", getActivePosters);

// Get Dashboard Posters (Protected, returns all for Admin/Principal, and uploader's soft-deleted ones)
router.get("/dashboard", protect, getDashboardPosters);
router.get("/student", protect, getStudentNotices);
router.get("/department", protect, getDepartmentPosters);
router.patch("/:id/read", protect, markPosterAsRead);

// Delete Poster
router.delete(
  "/:id",
  protect,
  allowRoles("chairman", "principal", "hod", "faculty"),
  deletePoster,
);

// Update Poster
router.put(
  "/:id",
  protect,
  allowRoles("chairman", "principal", "hod", "faculty"),
  updatePoster,
);

module.exports = router;
