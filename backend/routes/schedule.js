// filepath: backend/routes/schedule.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET /:tenantSlug/schedule
 * Public schedule list (published rodeos, tenant-scoped)
 * Returns structure expected by frontend SchedulePage
 */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const rodeos = await prisma.rodeo.findMany({
      where: {
        tenantId: req.tenantId,
        status: "published",
      },
      orderBy: { startDate: "asc" },
      include: {
        location: true,
        season: true,
      },
    });

    const season = rodeos?.[0]?.season || null;

    return res.json({
      season,
      events: rodeos || [],
    });
  } catch (err) {
    console.error("SCHEDULE_API_ERROR", err);
    return res.status(500).json({ error: "Failed to load schedule" });
  }
});

/**
 * GET /:tenantSlug/schedule/:slug
 * Public single rodeo (published, tenant-scoped)
 */
router.get("/:slug", resolveTenant, async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();

    const rodeo = await prisma.rodeo.findUnique({
      where: {
        slug_tenantId: {
          slug,
          tenantId: req.tenantId,
        },
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

    if (!rodeo || rodeo.status !== "published") {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    return res.json(rodeo);
  } catch (err) {
    console.error("SCHEDULE_ITEM_API_ERROR", err);
    return res.status(500).json({ error: "Failed to load schedule item" });
  }
});

export default router;