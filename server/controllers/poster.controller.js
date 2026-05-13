/** @format */

const Poster = require("../models/Poster");

const ROLE_AUDIENCES = ["hod", "faculty", "student"];
const DEPARTMENTS = ["computer", "electrical", "mechanical", "civil", "all"];

const parseArray = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
};

const sanitizeDepartments = (departments) => {
  const cleaned = departments.filter((department) =>
    DEPARTMENTS.includes(department)
  );

  return cleaned.length ? [...new Set(cleaned)] : ["all"];
};

const buildPosterAccess = (user, body) => {
  const requestedAudience = parseArray(body.targetAudience);
  const requestedDepartments = sanitizeDepartments(
    parseArray(body.targetDepartments, ["all"])
  );

  if (user.role === "principal" || user.role === "chairman") {
    if (body.visibilityMode === "all_hods") {
      return {
        targetAudience: ["hod"],
        targetDepartments: ["all"],
      };
    }

    if (body.visibilityMode === "selected_departments") {
      return {
        targetAudience: ROLE_AUDIENCES,
        targetDepartments: requestedDepartments.filter(
          (department) => department !== "all"
        ),
      };
    }

    return {
      targetAudience: ROLE_AUDIENCES,
      targetDepartments: ["all"],
    };
  }

  if (user.role === "hod") {
    const allowedAudience = requestedAudience.filter((audience) =>
      ["faculty", "student"].includes(audience)
    );

    return {
      targetAudience: allowedAudience.length
        ? [...new Set(allowedAudience)]
        : ["faculty", "student"],
      targetDepartments: [user.department],
    };
  }

  if (user.role === "faculty") {
    return {
      targetAudience: ["student"],
      targetDepartments: [user.department],
    };
  }

  return {
    targetAudience: [],
    targetDepartments: [],
  };
};

const isVisibleToUser = (poster, role, department) => {
  if (!role) return true;

  const audience = poster.targetAudience || [];
  const departments = poster.targetDepartments || [];
  const audienceAllowed = audience.includes("all") || audience.includes(role);
  const departmentAllowed =
    departments.includes("all") || departments.includes(department);

  return audienceAllowed && departmentAllowed;
};

const createPoster = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, priority, publishDate, expiryDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Poster file is required" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const { targetAudience, targetDepartments } = buildPosterAccess(
      req.user,
      req.body
    );

    const poster = await Poster.create({
      title,
      description,
      imageUrl: imageUrl,
      publicId: req.file.filename,
      uploadedBy: req.user._id,
      uploaderRole: req.user.role,
      targetAudience,
      targetDepartments,
      priority,
      publishDate: publishDate || new Date(),
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
      publishDate: { $lte: now },
      expiryDate: { $gte: now },
    }).sort({ createdAt: -1 });

    res.json(
      posters.filter((poster) =>
        isVisibleToUser(poster, role, department)
      )
    );
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
      req.user.role !== "admin" &&
      req.user.role !== "chairman"
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
    const { title, description, priority, publishDate, expiryDate } = req.body;

    const poster = await Poster.findById(req.params.id);

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    if (
      poster.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "principal" &&
      req.user.role !== "admin" &&
      req.user.role !== "chairman"
    ) {
      return res.status(403).json({ message: "Not authorized to edit this poster" });
    }

    poster.title = title || poster.title;
    poster.description = description || poster.description;
    poster.priority = priority || poster.priority;
    poster.publishDate = publishDate || poster.publishDate;
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
    if (
      req.user.role === "admin" ||
      req.user.role === "principal" ||
      req.user.role === "chairman"
    ) {
      // Admin/Principal see all posters
      query = {};
    } else if (req.user.role === "hod" || req.user.role === "faculty") {
      // HODs and faculty manage only posters uploaded by themselves
      query = { uploadedBy: req.user._id };
    } else {
      // Others see active posters for their department OR any inactive posters they uploaded themselves
      // (For simplicity, active posters are returned regardless of department since getActivePosters does the same)
      query = {
        $or: [
          {
            isActive: true,
            publishDate: { $lte: now },
            expiryDate: { $gte: now },
          },
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
