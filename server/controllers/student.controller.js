/** @format */

const fs = require("fs");
const User = require("../models/User");

const departmentMap = {
  computer: "computer",
  "computer department": "computer",
  "computer engineering": "computer",
  "computer science": "computer",
  "computer science engineering": "computer",
  cs: "computer",
  cse: "computer",
  electrical: "electrical",
  "electrical department": "electrical",
  "electrical and electronics": "electrical",
  "electrical engineering": "electrical",
  ee: "electrical",
  eee: "electrical",
  mechanical: "mechanical",
  "mechanical department": "mechanical",
  "mechanical engineering": "mechanical",
  me: "mechanical",
  civil: "civil",
  "civil department": "civil",
  "civil engineering": "civil",
  ce: "civil",
};

const normalizeDepartment = (value = "") => {
  const key = value.trim().toLowerCase();
  return departmentMap[key] || key;
};

const parseCSVLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseCSV = (content) => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^\uFEFF/, "").trim().toLowerCase()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);

    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
};

const uploadStudentsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const filePath = req.file.path;

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const rows = parseCSV(content);
      const { collegeName, collegeCode, collegeAddress } = req.user;
      const hodDepartment = normalizeDepartment(req.user.department);

      let addedCount = 0;
      let skippedCount = 0;
      let invalidCount = 0;
      let wrongDepartmentCount = 0;
      const wrongDepartments = new Set();

      for (const row of rows) {
        const cleanRow = {};

        for (const [key, value] of Object.entries(row)) {
          cleanRow[key.trim().toLowerCase()] = value ? value.trim() : "";
        }

        const name = cleanRow.name;
        const email = cleanRow.email;
        const department = normalizeDepartment(cleanRow.department);
        const className = cleanRow.class || "";

        if (!name || !email || !department) {
          invalidCount++;
          continue;
        }

        if (department !== hodDepartment) {
          wrongDepartmentCount++;
          wrongDepartments.add(cleanRow.department);
          continue;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          skippedCount++;
          continue;
        }

        await User.create({
          name,
          email,
          password: "12345",
          role: "student",
          department,
          className,
          collegeName,
          collegeCode,
          collegeAddress,
          forcePasswordChange: true,
        });

        addedCount++;
      }

      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: `Added ${addedCount} students with default password 12345. Skipped ${skippedCount} existing, ${invalidCount} invalid, and ${wrongDepartmentCount} outside your department. Expected department: ${hodDepartment}${
          wrongDepartments.size
            ? `. Found outside department values: ${[...wrongDepartments].join(", ")}`
            : ""
        }.`,
      });
    } catch (error) {
      console.error("Error processing CSV:", error);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(500).json({
        message: "Error processing CSV data",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDepartmentStudents = async (req, res) => {
  try {
    const department = normalizeDepartment(req.user.department);

    const students = await User.find({
      role: "student",
      department,
    })
      .select("-password")
      .sort({ name: 1 });

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateDepartmentStudent = async (req, res) => {
  try {
    const department = normalizeDepartment(req.user.department);
    const { name, email, className } = req.body;

    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
      department,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    student.name = name?.trim() || student.name;
    student.email = email?.trim() || student.email;
    student.className = className?.trim() || "";

    const updatedStudent = await student.save();

    return res.json({
      _id: updatedStudent._id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      role: updatedStudent.role,
      department: updatedStudent.department,
      className: updatedStudent.className,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteDepartmentStudent = async (req, res) => {
  try {
    const department = normalizeDepartment(req.user.department);

    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: "student",
      department,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetDepartmentStudentPassword = async (req, res) => {
  try {
    const department = normalizeDepartment(req.user.department);
    const newPassword = req.body.password?.trim() || "12345";

    if (newPassword.length < 5) {
      return res.status(400).json({ message: "Password must be at least 5 characters" });
    }

    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
      department,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.password = newPassword;
    student.forcePasswordChange = true;
    await student.save();

    return res.json({
      message: `Password reset to ${newPassword}. Student must change it after login.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadStudentsCSV,
  getDepartmentStudents,
  updateDepartmentStudent,
  deleteDepartmentStudent,
  resetDepartmentStudentPassword,
};
