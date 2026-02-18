// backend/routes/sponsorships.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

router.get("/resolve", async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, levels, slots } = req.query;

    const slotLimit = Number(slots) || 4;

    const numericContentId =
      contentId && contentId !== "null" && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const baseWhere = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
    };

    const placementOrder = [
      null,          // GLOBAL
      "SEASON",
      "EVENT",
      "ATHLETE",
    ];

    const levelWeight = {
      PREMIER: 4,
      FEATURED: 3,
      STANDARD: 2,
      SUPPORTER: 1,
    };

    const collected = [];
    const seenSponsors = new Set();

    async function fetchPlacement(type) {
      const where = {
        ...baseWhere,
        contentType: type,
        ...(type && numericContentId
          ? { contentId: numericContentId }
          : {}),
      };

      const rows = await prisma.sponsorship.findMany({
        where,
        include: { sponsor: true },
      });

      rows.forEach((r) => {
        if (!r?.sponsor) return;
        if (seenSponsors.has(r.sponsor.id)) return;

        collected.push({
          ...r,
          placementWeight: placementOrder.indexOf(type),
          levelWeight: levelWeight[r.level] || 0,
        });

        seenSponsors.add(r.sponsor.id);
      });
    }

    // Fetch in hierarchy order
    for (const type of placementOrder) {
      await fetchPlacement(type);
    }

    // Sort by:
    // 1. placement priority
    // 2. level weight
    // 3. priority field
    collected.sort((a, b) => {
      if (a.placementWeight !== b.placementWeight)
        return a.placementWeight - b.placementWeight;

      if (a.levelWeight !== b.levelWeight)
        return b.levelWeight - a.levelWeight;

      return (b.priority || 0) - (a.priority || 0);
    });

    const final = collected.slice(0, slotLimit);

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
