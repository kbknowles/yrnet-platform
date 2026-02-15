import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * ===============================
 * GET /api/sponsorships
 * Optional filters:
 *   ?levels=PREMIER,FEATURED
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const { levels } = req.query;

    const levelFilter =
      levels && typeof levels === "string"
        ? { level: { in: levels.split(",") } }
        : {};

    const sponsorships = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        ...levelFilter,
      },
      include: { sponsor: true },
      orderBy: [
        { priority: "desc" },
        { level: "asc" },
      ],
    });

    res.json(sponsorships);
  } catch (err) {
    console.error("Fetch sponsorships failed", err);
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

/**
 * ===============================
 * GET /api/sponsorships/resolve
 *
 * Query:
 *   contentType=SEASON|ATHLETE|EVENT|...
 *   contentId=number|null
 *   levels=PREMIER,FEATURED
 * ===============================
 */
router.get("/resolve", async (req, res) => {
  try {
    const now = new Date();
    const { contentType, contentId, levels } = req.query;

    const numericContentId =
      contentId && !isNaN(Number(contentId))
        ? Number(contentId)
        : null;

    const levelFilter =
      levels && typeof levels === "string"
        ? { level: { in: levels.split(",") } }
        : {};

    /**
     * DIRECT MATCH
     */
    const direct = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        ...(contentType ? { contentType } : {}),
        ...(numericContentId !== null
          ? { contentId: numericContentId }
          : {}),
        ...levelFilter,
      },
      include: { sponsor: true },
      orderBy: [
        { priority: "desc" },
        { level: "asc" },
      ],
    });

    /**
     * BACKFILL (GLOBAL / SEASON LEVEL)
     */
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
