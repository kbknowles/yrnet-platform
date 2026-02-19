// filepath: backend/routes/sponsorships.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/sponsorships/resolve
 * Simple Logic:
 * 1. Pull direct matches
 * 2. If not enough, backfill with GLOBAL (null/null)
 * 3. Respect levels
 * 4. De-duplicate
 */
router.get("/resolve", async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, levels, slots } = req.query;

    const slotLimit = Number(slots) || 4;

    const numericContentId =
      contentId && contentId !== "null" && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const levelFilter =
      levels && typeof levels === "string"
        ? { level: { in: levels.split(",") } }
        : {};

    // Normalize GLOBAL → null
    const normalizedContentType =
      contentType === "GLOBAL" ? null : contentType;

    const baseWhere = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
      ...levelFilter,
    };

    // 1️⃣ Direct matches
    const direct = await prisma.sponsorship.findMany({
      where: {
        ...baseWhere,
        ...(normalizedContentType !== undefined
          ? { contentType: normalizedContentType }
          : {}),
        ...(numericContentId !== null
          ? { contentId: numericContentId }
          : { contentId: null }),
      },
      include: { sponsor: true },
      orderBy: [{ priority: "desc" }],
    });

    const seen = new Set();
    const final = [];

    direct.forEach((d) => {
      if (d?.sponsor && !seen.has(d.sponsor.id) && final.length < slotLimit) {
        final.push(d);
        seen.add(d.sponsor.id);
      }
    });

    // 2️⃣ Backfill with GLOBAL (null/null) if needed
    if (final.length < slotLimit) {
      const backfill = await prisma.sponsorship.findMany({
        where: {
          ...baseWhere,
          contentType: null,
          contentId: null,
        },
        include: { sponsor: true },
        orderBy: [{ priority: "desc" }],
      });

      backfill.forEach((b) => {
        if (b?.sponsor && !seen.has(b.sponsor.id) && final.length < slotLimit) {
          final.push(b);
          seen.add(b.sponsor.id);
        }
      });
    }

    res.json({
      direct: final,
      backfill: [],
    });
  } catch (err) {
    console.error("Resolve sponsorship failed", err);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;
