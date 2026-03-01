// backend/routes/schedule.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

const router = express.Router();

console.log("🔥 SCHEDULE ROUTER LOADED");

/**
 * GET /api/schedule
 * Public schedule list (tenant scoped)
 */
router.get("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const events = await prisma.event.findMany({
      where: {
        tenantId: tenant.id,
        status: "published",
      },
      orderBy: { startDate: "asc" },
      include: {
        location: true,
        season: true,
      },
    });

    res.json(events);
  } catch (error) {
    console.error("SCHEDULE_API_ERROR", error);
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

/**
 * GET /api/schedule/:slug
 * Public single event (tenant scoped)
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
  } catch (error) {
    console.error("SCHEDULE_SINGLE_ERROR", error);
    res.status(500).json({ error: "Failed to load event" });
  }
});

export default router;
