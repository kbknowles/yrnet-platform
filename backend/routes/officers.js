// filepath: backend/routes/officers.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET active officers (public)
 * Optional query: ?seasonId=#
 */
router.get("/", async (req, res) => {
  try {
    const where = {
      active: true,
    };

    if (req.query.seasonId) {
      where.seasonId = parseInt(req.query.seasonId);
    }

    const officers = await prisma.officer.findMany({
      where,
      include: {
        season: true,
      },
      orderBy: [
        { type: "asc" },
        { role: "asc" },
        { name: "asc" },
      ],
    });

    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
