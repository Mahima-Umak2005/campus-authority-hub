/** @format */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, collegeName, collegeCode, collegeAddress } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "principal" || role === "chairman") {
      const existingCodeUser = await User.findOne({ collegeCode, role });
      if (existingCodeUser) {
        return res.status(400).json({ message: `A user with the role ${role === 'chairman' ? 'College Admin' : 'Principal'} already exists for this college code` });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department: department || "all",
      collegeName,
      collegeCode,
      collegeAddress,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      collegeName: user.collegeName,
      collegeCode: user.collegeCode,
      collegeAddress: user.collegeAddress,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      collegeName: user.collegeName,
      collegeCode: user.collegeCode,
      collegeAddress: user.collegeAddress,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    department: req.user.department,
    collegeName: req.user.collegeName,
    collegeCode: req.user.collegeCode,
    collegeAddress: req.user.collegeAddress,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
