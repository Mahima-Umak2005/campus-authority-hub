/** @format */

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    // File Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional Description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Main Category
    category: {
      type: String,
      required: true,
      enum: [
        "academic",
        "student",
        "faculty",
        "quality",
        "activities",
        "administration",
        "confidential",
      ],
    },

    // Sub Folder / Sub Category
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    // Department
    department: {
      type: String,
      required: true,
      enum: ["computer", "civil", "mechanical", "electrical", "all"],
    },

    // Cloudinary URL
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary Public ID
    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    // MIME Type
    fileType: {
      type: String,
      default: "",
      trim: true,
    },

    // Original Uploaded File Name
    originalName: {
      type: String,
      default: "",
      trim: true,
    },

    // Uploaded By
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Show on dashboard
    showOnDashboard: {
      type: Boolean,
      default: false,
    },

    // Confidential file
    isConfidential: {
      type: Boolean,
      default: false,
    },

    // Allowed Roles
    accessRoles: {
      type: [String],
      default: ["chairman", "principal", "hod", "faculty"],
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },

    // Academic Year
    academicYear: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("File", fileSchema);
