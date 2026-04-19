/** @format */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Campus Authority Hub API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
