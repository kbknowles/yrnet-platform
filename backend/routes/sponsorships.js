import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/sponsorships
 * Returns all active sponsorships
 */
router.get("/", async (req, res) => {
  try {
    const now = new Date();

    const sponsorships = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
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
 * GET /api/sponsorships/resolve
 * 
 * Query:
 *  contentType=ATHLETE|EVENT|LOCATION|GALLERY|ANNOUNCEMENT|SEASON
 *  contentId=number
 */
router.get("/resolve", async (req, res) => {
  try {
    const { contentType, contentId } = req.query;
    const now = new Date();

    const numericContentId =
      contentId && !isNaN(Number(contentId))
        ? Number(contentId)
        : undefined;

    const direct = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        ...(contentType ? { contentType } : {}),
        ...(numericContentId !== undefined
          ? { contentId: numericContentId }
          : {}),
      },
      include: { sponsor: true },
      orderBy: [
        { priority: "desc" },
        { level: "asc" },
      ],
    });

    const backfill = await prisma.sponsorship.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
        contentType: null,
        contentId: null,
      },
      include: { sponsor: true },
      orderBy: [
        { level: "asc" },
        { priority: "desc" },
      ],
    });

    res.json({ direct, backfill });
  } catch (err) {
    console.error("Resolve sponsorship failed", err);
    res.status(500).json({ error: "Failed to resolve sponsorships" });
  }
});

export default router;
