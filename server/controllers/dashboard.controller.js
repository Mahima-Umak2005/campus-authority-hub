/** @format */

const User = require("../models/User");
const File = require("../models/File");
const Poster = require("../models/Poster");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const isDepartmentRole = ["hod", "faculty", "student"].includes(
      req.user.role
    );
    const department = req.user.department;

    const userFilter = isDepartmentRole
      ? { department }
      : {};

    const fileFilter = isDepartmentRole
      ? { department: { $in: [department, "all"] } }
      : {};

    const posterFilter = {
      isActive: true,
      expiryDate: { $gte: now },
      ...(isDepartmentRole
        ? { targetDepartments: { $in: [department, "all"] } }
        : {}),
    };

    const [totalUsers, totalFiles, activePosters, departments] =
      await Promise.all([
        User.countDocuments(userFilter),
        File.countDocuments(fileFilter),
        Poster.countDocuments(posterFilter),
        User.distinct("department", {
          department: { $nin: ["all", null, ""] },
        }),
      ]);

    res.json({
      totalUsers,
      totalFiles,
      activePosters,
      departments: departments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
