import express from "express";
import bcrypt from "bcryptjs"; // Change to bcryptjs
import prisma from "./prismaClient.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Change to bcryptjs.hash

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatching = await bcrypt.compare(password, user.password); // Change to bcryptjs.compare

    if (!isMatching) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Login failed",
      errorData: err,
    });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
