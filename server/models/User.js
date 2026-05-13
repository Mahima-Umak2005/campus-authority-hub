/** @format */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["chairman", "principal", "hod", "faculty", "admin", "student"],
      required: true,
    },
    department: {
      type: String,
      enum: ["computer", "electrical", "mechanical", "civil", "all"],
      default: "all",
    },
    collegeName: { type: String },
    collegeCode: { type: String, sparse: true },
    collegeAddress: { type: String },
    className: { type: String },
    forcePasswordChange: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
