/** @format */

const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

// ======================================
// Detect Resource Type
// ======================================
const getResourceType = (mimeType = "") => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "raw"; // pdf, docx, xlsx, zip etc.
};

// ======================================
// Upload Buffer To Cloudinary
// ======================================
const uploadToCloudinary = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceType(file.mimetype);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// ======================================
// Upload File
// ======================================
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file selected",
      });
    }

    const {
      title,
      description,
      category,
      subCategory,
      department,
      uploadedBy,
      showOnDashboard,
      isConfidential,
      accessRoles,
      academicYear,
      tags,
    } = req.body;

    if (!title || !category || !subCategory || !department || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const result = await uploadToCloudinary(req.file, "campus_repository");

    const newFile = new File({
      title,
      description,
      category,
      subCategory,
      department,
      uploadedBy,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
      showOnDashboard: showOnDashboard === "true",
      isConfidential: isConfidential === "true",
      accessRoles: accessRoles
        ? accessRoles.split(",").map((r) => r.trim())
        : ["chairman", "principal", "hod", "faculty"],
      academicYear,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Files
// ======================================
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("uploadedBy", "name role department")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Dashboard Files
// ======================================
exports.getDashboardFiles = async (req, res) => {
  try {
    const { role, department } = req.query;

    let filter = { showOnDashboard: true };

    if (role !== "principal" && role !== "chairman") {
      filter.$or = [{ department: department }, { department: "all" }];
    }

    const files = await File.find(filter).sort({ createdAt: -1 }).limit(10);

    res.json(files);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Repository Structure
// ======================================
exports.getRepositoryStructure = async (req, res) => {
  try {
    const files = await File.find();

    const structure = {};

    files.forEach((file) => {
      if (!structure[file.category]) {
        structure[file.category] = {};
      }

      if (!structure[file.category][file.subCategory]) {
        structure[file.category][file.subCategory] = [];
      }

      structure[file.category][file.subCategory].push(file);
    });

    res.json(structure);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Download File
// ======================================
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const resourceType = getResourceType(file.fileType);

    const url = cloudinary.url(file.publicId, {
      resource_type: resourceType,
      type: "upload",
      flags: "attachment",
    });

    return res.redirect(url);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Delete File
// ======================================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const resourceType = getResourceType(file.fileType);

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: resourceType,
    });

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
