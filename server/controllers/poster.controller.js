/** @format */

const Poster = require("../models/Poster");
const cloudinary = require("../config/cloudinary");

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

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "college-posters",
    });

    const poster = await Poster.create({
      title,
      description,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
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

    await Poster.findByIdAndDelete(req.params.id);

    res.json({ message: "Poster deleted successfully" });
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
module.exports = {
  createPoster,
  getActivePosters,
  deletePoster,
  updatePoster,
};
