// backend/routes/admin/seasons.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * GET all seasons
 */
router.get("/", async (req, res) => {
  const seasons = await prisma.season.findMany({
    orderBy: { startDate: "desc" },
  });

  res.json(seasons);
});

/**
 * CREATE season
 */
router.post("/", async (req, res) => {
  const { year, startDate, endDate, active } = req.body;

  const season = await prisma.season.create({
    data: {
      year,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      active: !!active,
    },
  });

  res.json(season);
});

export default router;
