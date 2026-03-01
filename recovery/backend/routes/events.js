// backend/routes/events.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

const router = express.Router();

console.log("🔥 EVENTS ROUTER LOADED");

/**
 * GET /api/events
 * Public, published events only (tenant scoped)
 */
router.get("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const events = await prisma.event.findMany({
      where: {
        status: "published",
        tenantId: tenant.id,
      },
      orderBy: { startDate: "asc" },
      take: limit,
      include: {
        location: true,
        season: true,
      },
    });

    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/events/:slug
 * Public single event by slug (tenant scoped)
 */
router.get("/:slug", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const slug = req.params.slug.toLowerCase();

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: "published",
        tenantId: tenant.id,
      },
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

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
