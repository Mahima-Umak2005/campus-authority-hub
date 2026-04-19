/** @format */

const Poster = require("../models/Poster");

const createPoster = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      targetAudience,
      targetDepartments,
      priority,
      expiryDate,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Poster file is required" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const poster = await Poster.create({
      title,
      description,
      imageUrl: imageUrl,
      publicId: req.file.filename,
      uploadedBy: req.user._id,
      uploaderRole: req.user.role,
      targetAudience: targetAudience ? JSON.parse(targetAudience) : [],
      targetDepartments: targetDepartments ? JSON.parse(targetDepartments) : [],
      priority,
      expiryDate,
    });

    res.status(201).json(poster);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    const fs = require('fs');
    const path = require('path');
    fs.appendFileSync(path.join(__dirname, '../error.log'), new Date().toISOString() + " UPLOAD ERROR: " + error.stack + "\n");
    res.status(500).json({ message: error.message });
  }
};

const getActivePosters = async (req, res) => {
  try {
    const { role, department } = req.query;
    const now = new Date();

    const posters = await Poster.find({
      isActive: true,
      expiryDate: { $gte: now },
    }).sort({ createdAt: -1 });

    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deletePoster = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    if (
      poster.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "principal" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this poster" });
    }

    poster.isActive = false;
    await poster.save();

    res.json({ message: "Poster soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updatePoster = async (req, res) => {
  try {
    const { title, description, priority, expiryDate } = req.body;

    const poster = await Poster.findById(req.params.id);

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    if (
      poster.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "principal" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to edit this poster" });
    }

    poster.title = title || poster.title;
    poster.description = description || poster.description;
    poster.priority = priority || poster.priority;
    poster.expiryDate = expiryDate || poster.expiryDate;

    const updatedPoster = await poster.save();

    res.json(updatedPoster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardPosters = async (req, res) => {
  try {
    const { role, department } = req.query;
    const now = new Date();
    
    let query = {};
    if (req.user.role === "admin" || req.user.role === "principal") {
      // Admin/Principal see all posters
      query = {};
    } else {
      // Others see active posters for their department OR any inactive posters they uploaded themselves
      // (For simplicity, active posters are returned regardless of department since getActivePosters does the same)
      query = {
        $or: [
          { isActive: true, expiryDate: { $gte: now } },
          { uploadedBy: req.user._id }
        ]
      };
    }
    
    const posters = await Poster.find(query).sort({ createdAt: -1 });
    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPoster,
  getActivePosters,
  deletePoster,
  updatePoster,
  getDashboardPosters,
};
