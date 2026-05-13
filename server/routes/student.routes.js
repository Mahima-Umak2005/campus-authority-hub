/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  uploadStudentsCSV,
  getDepartmentStudents,
  updateDepartmentStudent,
  deleteDepartmentStudent,
  resetDepartmentStudentPassword,
} = require("../controllers/student.controller");
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Set up multer for file upload
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `students-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isCsv =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/csv" ||
      file.mimetype === "text/plain" ||
      path.extname(file.originalname).toLowerCase() === ".csv";

    if (isCsv) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
});

router.post(
  "/upload-csv",
  protect,
  allowRoles("hod"),
  upload.single("csvFile"),
  uploadStudentsCSV
);

router.get("/", protect, allowRoles("hod"), getDepartmentStudents);
router.put("/:id", protect, allowRoles("hod"), updateDepartmentStudent);
router.delete("/:id", protect, allowRoles("hod"), deleteDepartmentStudent);
router.patch(
  "/:id/reset-password",
  protect,
  allowRoles("hod"),
  resetDepartmentStudentPassword
);

module.exports = router;
