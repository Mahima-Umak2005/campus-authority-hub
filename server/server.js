/** @format */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const posterRoutes = require("./routes/poster.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const fileRoutes = require("./routes/file.routes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Campus Authority Hub API Running...");
});

const fs = require("fs");

// Global Error Handler
app.use((err, req, res, next) => {
  const logMessage = new Date().toISOString() + " - " + err.stack + "\n";
  fs.appendFileSync(path.join(__dirname, "error.log"), logMessage);
  console.error("Express Error:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
