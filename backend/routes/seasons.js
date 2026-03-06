// filepath: backend/routes/seasons.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET /:tenantSlug/seasons
 * Public – tenant-scoped
 */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      where: {
        tenantId: req.tenantId,
      },
      orderBy: { startDate: "desc" },
    });

    res.json(seasons || []);
  } catch (err) {
    console.error("GET /api/:tenantSlug/seasons failed", err);
    res.status(500).json({ error: "Failed to load seasons" });
  }
});

export default router;