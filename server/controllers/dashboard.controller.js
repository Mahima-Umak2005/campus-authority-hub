/** @format */

const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.json({
      totalUsers,
      totalFiles: 0,
      activePosters: 0,
      departments: 4,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
