// filepath: backend/routes/officers.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET active officers for current season (public)
 */
router.get("/", async (req, res) => {
  try {
    const currentSeason = await prisma.season.findFirst({
      where: { active: true },
      select: { id: true },
    });

    if (!currentSeason) {
      return res.json([]);
    }

    const officers = await prisma.officer.findMany({
      where: {
        active: true,
        seasonId: currentSeason.id,
      },
      select: {
        id: true,
        name: true,
        role: true,
        type: true,
        phone: true,
      },
      orderBy: [
        { type: "asc" },   // EXECUTIVE → DIRECTOR → STUDENT
        { role: "asc" },   // enum order
        { name: "asc" },
      ],
    });

    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
