/** @format */

const fs = require("fs");
const csv = require("csv-parser");
const User = require("../models/User");

const uploadStudentsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const { collegeName, collegeCode, collegeAddress } = req.user;
          let addedCount = 0;
          let skippedCount = 0;

          for (const row of results) {
            // Trim keys and values
            const cleanRow = {};
            for (const [key, value] of Object.entries(row)) {
              cleanRow[key.trim().toLowerCase()] = value ? value.trim() : "";
            }

            const name = cleanRow.name;
            const email = cleanRow.email;
            const password = cleanRow.password;
            const department = cleanRow.department;
            const className = cleanRow.class || ""; // optional class

            if (!name || !email || !password || !department) {
              console.log("Skipping invalid row (missing required fields):", cleanRow);
              continue;
            }

            // Check if student already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              skippedCount++;
              continue;
            }

            await User.create({
              name,
              email,
              password,
              role: "student",
              department: department.toLowerCase(),
              className,
              collegeName,
              collegeCode,
              collegeAddress,
            });
            addedCount++;
          }

          // Clean up the uploaded file
          fs.unlinkSync(filePath);

          res.status(200).json({
            message: `Successfully added ${addedCount} students. Skipped ${skippedCount} existing or invalid students.`,
          });
        } catch (error) {
          console.error("Error processing CSV:", error);
          res.status(500).json({ message: "Error processing CSV data", error: error.message });
        }
      })
      .on("error", (error) => {
        res.status(500).json({ message: "Error reading CSV file", error: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadStudentsCSV,
};
