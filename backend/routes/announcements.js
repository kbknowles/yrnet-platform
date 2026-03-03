// filepath: backend/routes/announcements.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/**
 * GET /api/:tenantSlug/announcements
 */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        tenantId: req.tenantId,
        published: true,
        AND: [
          {
            OR: [{ publishAt: null }, { publishAt: { lte: now } }],
          },
          {
            OR: [{ expireAt: null }, { expireAt: { gte: now } }],
          },
        ],
      },
      orderBy: [
        { sortOrder: "asc" },
        { publishAt: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        rodeo: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return res.json(announcements);
  } catch (err) {
    console.error("ANNOUNCEMENTS_API_ERROR", err);
    return res.status(500).json({
      error: "Failed to load announcements",
      detail: err?.message || String(err),
    });
  }
});

export default router;