import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./authRoutes.js";
import scoreRoutes from "./scoreRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", scoreRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
