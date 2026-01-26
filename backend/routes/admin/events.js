// filepath: backend/routes/admin/events.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * GET all events
 */
router.get("/", async (req, res) => {
  const events = await prisma.event.findMany({
    include: {
      season: true,
      location: true,
    },
    orderBy: { startDate: "asc" },
  });

  res.json(events);
});

/**
 * CREATE event
 */
router.post("/", async (req, res) => {
  const {
    name,
    slug,
    startDate,
    endDate,
    seasonId,
    locationId,
  } = req.body;

  const event = await prisma.event.create({
    data: {
      name,
      slug,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      seasonId: Number(seasonId),
      locationId: Number(locationId),
    },
  });

  res.json(event);
});

export default router;
