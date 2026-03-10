// filepath: backend/routes/sponsorships.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET /:tenantSlug/sponsorships/resolve
 *
 * Example:
 * /ahsra/sponsorships/resolve?contentType=GLOBAL&slots=4
 *
 * Hierarchy
 * Content:
 *   GLOBAL(null) → SEASON → RODEO → ATHLETE
 *
 * Level:
 *   PREMIER → FEATURED → STANDARD → SUPPORTER
 *
 * Stops once slots are filled.
 */

router.get("/resolve", resolveTenant, async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, slots } = req.query;

    const slotLimit = Number(slots) || 4;

    const numericContentId =
      contentId && contentId !== "null" && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const normalizedType =
      contentType === "GLOBAL" || !contentType ? null : contentType;

    const baseWhere = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
      sponsor: {
        tenantId: req.tenantId,
        active: true,
      },
    };

    const contentHierarchy = [null, "SEASON", "RODEO", "ATHLETE"];
    const levelHierarchy = ["PREMIER", "FEATURED", "STANDARD", "SUPPORTER"];

    const collected = [];
    const seenSponsors = new Set();

    async function fetchLayer(type, level) {
      const where = {
        ...baseWhere,
        contentType: type,
        level,
      };

      if (type && numericContentId !== null) {
        where.contentId = numericContentId;
      }

      const rows = await prisma.sponsorship.findMany({
        where,
        include: { sponsor: true },
        orderBy: [{ priority: "desc" }],
      });

      for (const row of rows) {
        if (!row?.sponsor) continue;
        if (seenSponsors.has(row.sponsor.id)) continue;
        if (collected.length >= slotLimit) break;

        collected.push(row);
        seenSponsors.add(row.sponsor.id);
      }
    }

    const startIndex = contentHierarchy.indexOf(normalizedType);

    const orderedContentTypes =
      startIndex >= 0
        ? contentHierarchy.slice(startIndex)
        : contentHierarchy;

    for (const type of orderedContentTypes) {
      for (const level of levelHierarchy) {
        if (collected.length >= slotLimit) break;
        await fetchLayer(type, level);
      }

      if (collected.length >= slotLimit) break;
    }

    res.json({
      direct: collected,
      backfill: [],
    });
  } catch (error) {
    console.error("Resolve sponsorship failed:", error);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;