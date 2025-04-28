import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./authRoutes.js";
import scoreRoutes from "./scoreRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", scoreRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
