import express from "express";
import prisma from "./prismaClient.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

router.post("/score", authenticateToken, async (req, res) => {
  const { wpm, accuracy } = req.body;

  const userId = req.user.userId;

  try {
    const newScore = await prisma.score.create({
      data: {
        wpm: wpm,
        accuracy: accuracy,
        userId: userId,
      },
    });

    return res.status(200).json({ message: "Score saved.", score: newScore });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while saving scores." });
  }
});

router.get("/leaderboard", authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const getScores = await prisma.score.findMany({
      orderBy: { wpm: "desc" },
      take: limit,
      include: { user: { select: { email: true } } },
    });

    return res.status(200).json({ leaderboard: getScores });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while retrieving leaderboard scores.",
      errorData: error,
    });
  }
});

export default router;
