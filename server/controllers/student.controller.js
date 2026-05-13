/** @format */

const fs = require("fs");
const User = require("../models/User");

const departmentMap = {
  computer: "computer",
  "computer science": "computer",
  "computer science engineering": "computer",
  cse: "computer",
  electrical: "electrical",
  "electrical engineering": "electrical",
  ee: "electrical",
  mechanical: "mechanical",
  "mechanical engineering": "mechanical",
  me: "mechanical",
  civil: "civil",
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
        });

        addedCount++;
      }

      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: `Added ${addedCount} students with default password 12345. Skipped ${skippedCount} existing, ${invalidCount} invalid, and ${wrongDepartmentCount} outside your department.`,
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

module.exports = {
  uploadStudentsCSV,
};
