require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(cors({
  origin: ["https://stay-ease-9u5a.vercel.app"], // allow all (easy fix)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" })); // for image upload

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.log("Server Error:", err.message);
  res.status(500).json({ message: "Server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});