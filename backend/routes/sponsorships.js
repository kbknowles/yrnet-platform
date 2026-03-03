// filepath: backend/routes/sponsorships.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/**
 * GET /api/:tenantSlug/sponsorships/resolve
 *
 * Hierarchy:
 * ContentType order:
 *   GLOBAL(null) → SEASON → RODEO → ATHLETE
 *
 * Level order:
 *   PREMIER → FEATURED → STANDARD → SUPPORTER
 *
 * Stops once slots are filled.
 */
router.get("/:tenantSlug/resolve", resolveTenant, async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, slots } = req.query;

    const slotLimit = Number(slots) || 4;

    const numericContentId =
      contentId && contentId !== "null" && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const baseWhere = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
      sponsor: {
        tenantId: req.tenantId,
        active: true,
      },
    };

    // Normalize GLOBAL → null
    const normalizedType =
      contentType === "GLOBAL" ? null : contentType;

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

      // Only match specific contentId when NOT GLOBAL
      if (type && numericContentId !== null) {
        where.contentId = numericContentId;
      }

      const rows = await prisma.sponsorship.findMany({
        where,
        include: { sponsor: true },
        orderBy: [{ priority: "desc" }],
      });

      rows.forEach((r) => {
        if (!r?.sponsor) return;
        if (seenSponsors.has(r.sponsor.id)) return;
        if (collected.length >= slotLimit) return;

        collected.push(r);
        seenSponsors.add(r.sponsor.id);
      });
    }

    // Start from requested type position in hierarchy
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
  } catch (err) {
    console.error("Resolve sponsorship failed", err);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;