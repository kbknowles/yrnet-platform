// filepath: backend/routes/officers.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET active officers for current season (public, tenant-scoped)
 * GET /api/:tenantSlug/officers
 */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const currentSeason = await prisma.season.findFirst({
      where: {
        tenantId: req.tenantId,
        active: true,
      },
      select: { id: true },
    });

    if (!currentSeason) {
      return res.json([]);
    }

    const officers = await prisma.officer.findMany({
      where: {
        tenantId: req.tenantId,
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
        { type: "asc" },
        { role: "asc" },
        { name: "asc" },
      ],
    });

    res.json(officers || []);
  } catch (err) {
    console.error("PUBLIC_OFFICERS_ERROR", err);
    res.status(200).json([]);
  }
});

export default router;