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

    const departmentPosterFilter = isDepartmentRole
      ? { targetDepartments: { $in: [department, "all"] } }
      : {};

    const posterFilter = {
      isActive: true,
      publishDate: { $lte: now },
      expiryDate: { $gte: now },
      ...departmentPosterFilter,
    };

    const [
      totalUsers,
      totalFiles,
      activePosters,
      departments,
      totalStudents,
      totalFaculty,
      totalHods,
      scheduledPosters,
      expiredPosters,
      deletedPosters,
      departmentPosters,
    ] =
      await Promise.all([
        User.countDocuments(userFilter),
        File.countDocuments(fileFilter),
        Poster.countDocuments(posterFilter),
        User.distinct("department", {
          department: { $nin: ["all", null, ""] },
        }),
        User.countDocuments({ ...userFilter, role: "student" }),
        User.countDocuments({ ...userFilter, role: "faculty" }),
        User.countDocuments({ ...userFilter, role: "hod" }),
        Poster.countDocuments({
          isActive: true,
          publishDate: { $gt: now },
          ...departmentPosterFilter,
        }),
        Poster.countDocuments({
          isActive: true,
          expiryDate: { $lt: now },
          ...departmentPosterFilter,
        }),
        Poster.countDocuments({
          isActive: false,
          ...departmentPosterFilter,
        }),
        Poster.find(departmentPosterFilter).select("readBy").lean(),
      ]);

    const readMarks = departmentPosters.reduce(
      (total, poster) => total + (poster.readBy?.length || 0),
      0
    );

    res.json({
      totalUsers,
      totalFiles,
      activePosters,
      departments: departments.length,
      totalStudents,
      totalFaculty,
      totalHods,
      scheduledPosters,
      expiredPosters,
      deletedPosters,
      totalDepartmentPosters: departmentPosters.length,
      readMarks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
