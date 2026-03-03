// filepath: backend/routes/rodeos.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/**
 * GET /api/:tenantSlug/rodeos
 * Public, published rodeos only (tenant-scoped)
 */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const limitRaw = req.query.limit;
    const limit = limitRaw ? Number(limitRaw) : undefined;

    const rodeos = await prisma.rodeo.findMany({
      where: {
        tenantId: req.tenantId,
        status: "published",
      },
      orderBy: { startDate: "asc" },
      take: Number.isFinite(limit) ? limit : undefined,
      include: {
        location: true,
        season: true,
      },
    });

    return res.json(rodeos);
  } catch (err) {
    console.error("RODEOS_API_ERROR", err);
    return res.status(500).json({ error: "Failed to load rodeos" });
  }
});

/**
 * GET /api/:tenantSlug/rodeos/:slug
 * Public single rodeo by slug (tenant-scoped)
 */
router.get("/:tenantSlug/:slug", resolveTenant, async (req, res) => {
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
    console.error("RODEO_API_ERROR", err);
    return res.status(500).json({ error: "Failed to load rodeo" });
  }
});

export default router;