import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./authRoutes.js";
import scoreRoutes from "./scoreRoutes.js";

const app = express();

// CORS configuration - Allow frontend URL to communicate with the backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allowing the frontend to access the backend
    credentials: true,
  })
);

app.use(express.json());

// Setting up routes
app.use("/api", authRoutes);
app.use("/api", scoreRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Get port from environment or fallback to 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
