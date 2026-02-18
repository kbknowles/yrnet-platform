// backend/routes/sponsorships.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/sponsorships/resolve
 */
router.get("/resolve", async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, levels } = req.query;

    const numericContentId =
      contentId && contentId !== "null" && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const levelFilter =
      levels && typeof levels === "string"
        ? { level: { in: levels.split(",") } }
        : {};

    // 🔑 Translate GLOBAL → null
    const normalizedContentType =
      contentType === "GLOBAL" ? null : contentType;

    // DIRECT MATCH
    const direct = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        ...(normalizedContentType !== undefined
          ? { contentType: normalizedContentType }
          : {}),
        ...(numericContentId !== null
          ? { contentId: numericContentId }
          : { contentId: null }),
        ...levelFilter,
      },
      include: { sponsor: true },
      orderBy: [
        { priority: "desc" },
        { level: "asc" },
      ],
    });

    // GLOBAL BACKFILL (null/null)
    const backfill = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        contentType: null,
        contentId: null,
        ...levelFilter,
      },
      include: { sponsor: true },
      orderBy: [
        { priority: "desc" },
        { level: "asc" },
      ],
    });

    res.json({ direct, backfill });
  } catch (err) {
    console.error("Resolve sponsorship failed", err);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;
