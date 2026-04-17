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
} = require("../controllers/poster.controller");

// Create Poster
router.post(
  "/",
  protect,
  allowRoles("chairman", "principal", "hod", "faculty"),
  upload.single("poster"),
  createPoster,
);

// Get Active Posters
router.get("/active", protect, getActivePosters);

// Delete Poster
router.delete(
  "/:id",
  protect,
  allowRoles("chairman", "principal", "hod", "faculty"),
  deletePoster,
);

module.exports = router;
