/** @format */

const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

const APPROVER_ROLES = ["chairman", "principal", "admin"];
const DEPARTMENT_ROLES = ["hod", "faculty", "student"];
const VALID_DEPARTMENTS = ["computer", "civil", "mechanical", "electrical", "all"];
const VALID_CATEGORIES = [
  "academic",
  "student",
  "faculty",
  "quality",
  "activities",
  "administration",
  "confidential",
];

const canApproveFiles = (user) => APPROVER_ROLES.includes(user.role);

const canAccessFile = (file, user) => {
  if (!user) return false;
  if (canApproveFiles(user)) return true;

  const uploadedBy = file.uploadedBy?._id || file.uploadedBy;
  const isUploader = uploadedBy?.toString() === user._id.toString();
  if (isUploader) return true;

  const effectiveStatus = file.approvalStatus || "approved";
  if (effectiveStatus !== "approved") return false;
  if (!file.accessRoles?.includes(user.role)) return false;
  if (file.isConfidential && !["chairman", "principal", "admin", "hod"].includes(user.role)) {
    return false;
  }

  return file.department === "all" || file.department === user.department;
};

const buildRepositoryFilter = (req) => {
  const { search, department, category, status } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { subCategory: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (department && department !== "all") filter.department = department;
  if (category && category !== "all") filter.category = category;
  if (status && status !== "all") {
    filter.approvalStatus =
      status === "approved" ? { $in: ["approved", null] } : status;
  }

  if (!canApproveFiles(req.user)) {
    const visibilityFilter = {
      $or: [
        {
          approvalStatus: { $in: ["approved", null] },
          accessRoles: req.user.role,
          department: { $in: [req.user.department, "all"] },
        },
        { uploadedBy: req.user._id },
      ],
    };

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, visibilityFilter];
      delete filter.$or;
    } else {
      Object.assign(filter, visibilityFilter);
    }
  }

  return filter;
};

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
      showOnDashboard,
      isConfidential,
      accessRoles,
      academicYear,
      tags,
    } = req.body;

    const finalDepartment = DEPARTMENT_ROLES.includes(req.user.role)
      ? req.user.department
      : department;
    const finalSubCategory = subCategory?.trim() || "General";
    const missingFields = [];

    if (!title?.trim()) missingFields.push("title");
    if (!category?.trim()) missingFields.push("category");
    if (!finalDepartment?.trim()) missingFields.push("department");

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category selected",
      });
    }

    if (!VALID_DEPARTMENTS.includes(finalDepartment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department selected",
      });
    }

    const approvalStatus = canApproveFiles(req.user) ? "approved" : "pending";

    const result = await uploadToCloudinary(req.file, "campus_repository");

    const newFile = new File({
      title: title.trim(),
      description,
      category,
      subCategory: finalSubCategory,
      department: finalDepartment,
      uploadedBy: req.user._id,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
      showOnDashboard: showOnDashboard === "true",
      isConfidential: isConfidential === "true",
      accessRoles: accessRoles
        ? accessRoles.split(",").map((r) => r.trim())
        : ["chairman", "principal", "hod", "faculty"],
      approvalStatus,
      approvedBy: approvalStatus === "approved" ? req.user._id : undefined,
      approvedAt: approvalStatus === "approved" ? new Date() : undefined,
      academicYear,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      message:
        approvalStatus === "approved"
          ? "File uploaded successfully"
          : "File uploaded and sent for approval",
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
    const files = await File.find(buildRepositoryFilter(req))
      .populate("uploadedBy", "name role department")
      .populate("approvedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(files.filter((file) => canAccessFile(file, req.user)));
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
    const role = req.user?.role || req.query.role;
    const department = req.user?.department || req.query.department;

    let filter = {
      showOnDashboard: true,
      approvalStatus: { $in: ["approved", null] },
      accessRoles: role,
    };

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
    const files = await File.find(buildRepositoryFilter(req));
    const visibleFiles = files.filter((file) => canAccessFile(file, req.user));

    const structure = {};

    visibleFiles.forEach((file) => {
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

    if (!canAccessFile(file, req.user)) {
      return res.status(403).json({
        message: "You do not have access to this file",
      });
    }

    file.downloadCount += 1;
    await file.save();

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
// Approve / Reject File
// ======================================
exports.updateApprovalStatus = async (req, res) => {
  try {
    if (!canApproveFiles(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to approve repository files",
      });
    }

    const { status, rejectionReason = "" } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    file.approvalStatus = status;
    file.rejectionReason = status === "rejected" ? rejectionReason : "";
    file.approvedBy = status === "approved" ? req.user._id : undefined;
    file.approvedAt = status === "approved" ? new Date() : undefined;

    await file.save();

    res.json({
      success: true,
      message: `File ${status} successfully`,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
