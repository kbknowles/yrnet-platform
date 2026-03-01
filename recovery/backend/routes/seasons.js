// filepath: backend/routes/seasons.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/seasons
 * Public – used by homepage
 */
router.get("/", async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });

    res.json(seasons);
  } catch (err) {
    console.error("GET /api/seasons failed", err);
    res.status(500).json({ error: "Failed to load seasons" });
  }
});

export default router;
