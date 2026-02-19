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

    const levelFilter =
      levels && typeof levels === "string"
        ? { level: { in: levels.split(",") } }
        : {};

    const baseWhere = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
      ...levelFilter,
    };

    const results = [];
    const seen = new Set();

    async function fetchMatches(where) {
      if (results.length >= slotLimit) return;

      const rows = await prisma.sponsorship.findMany({
        where: { ...baseWhere, ...where },
        include: { sponsor: true },
        orderBy: [
          { level: "asc" },       // PREMIER first (enum order)
          { priority: "desc" },
        ],
      });

      for (const r of rows) {
        if (results.length >= slotLimit) break;
        if (!r?.sponsor) continue;
        if (seen.has(r.sponsor.id)) continue;

        seen.add(r.sponsor.id);
        results.push(r);
      }
    }

    // === STRICT HIERARCHY ===

    if (contentType === "EVENT") {
      await fetchMatches({
        contentType: "EVENT",
        contentId: numericContentId,
      });

      await fetchMatches({
        contentType: "SEASON",
      });

      await fetchMatches({
        contentType: null,
        contentId: null,
      });

    } else if (contentType === "SEASON") {
      await fetchMatches({
        contentType: "SEASON",
        contentId: numericContentId,
      });

      await fetchMatches({
        contentType: null,
        contentId: null,
      });

    } else {
      // GLOBAL zone
      await fetchMatches({
        contentType: null,
        contentId: null,
      });
    }

    res.json({
      direct: results,
      backfill: [],
    });

  } catch (err) {
    console.error("Resolve sponsorship failed", err);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;
