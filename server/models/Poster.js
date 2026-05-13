/** @format */

const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploaderRole: {
      type: String,
      enum: ["chairman", "principal", "hod", "faculty"],
      required: true,
    },
    targetAudience: [{ type: String }],
    targetDepartments: [{ type: String }],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isPinned: { type: Boolean, default: false },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Poster", posterSchema);
