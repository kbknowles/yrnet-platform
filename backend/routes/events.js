// filepath: backend/routes/events.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/events
 * Public, published events only
 * Optional: ?limit=number
 */
router.get("/", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const events = await prisma.event.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      startDate: "asc",
    },
    take: limit,
    include: {
      location: true,
      season: true,
    },
  });

  res.json(events);
});

/**
 * GET /api/events/:slug
 * Public single event by slug
 */
router.get("/:slug", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { slug: req.params.slug },
    include: {
      location: true,
      season: true,
      scheduleItems: {
        orderBy: { date: "asc" },
      },
      announcements: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!event || event.status !== "published") {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json(event);
});

export default router;
