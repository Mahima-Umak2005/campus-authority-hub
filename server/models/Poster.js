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
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Poster", posterSchema);
