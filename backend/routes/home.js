// filepath: backend/routes/home.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/**
 * GET /api/:tenantSlug/home
 * Public homepage payload (tenant-isolated)
 * Must never hard-crash if DB is empty.
 */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const now = new Date();
    const tenantId = req.tenantId;

    const [announcements, rodeos, sponsors, featuredAthletes] =
      await Promise.all([
        prisma.announcement.findMany({
          where: {
            tenantId,
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
                startDate: true,
                endDate: true,
              },
            },
          },
        }),

        prisma.rodeo.findMany({
          where: {
            tenantId,
            status: "published",
          },
          orderBy: { startDate: "asc" },
          take: 6,
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            endDate: true,
          },
        }),

        prisma.sponsor.findMany({
          where: {
            tenantId,
            active: true,
          },
          orderBy: [{ createdAt: "desc" }],
          take: 12,
          select: {
            id: true,
            name: true,
            website: true,
            logoUrl: true,
            description: true,
          },
        }),

        prisma.athlete.findMany({
          where: {
            tenantId,
            isActive: true,
            isFeatured: true,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          take: 10,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            slug: true,
            school: true,
            grade: true,
            hometown: true,
            headshotUrl: true,
            events: true,
          },
        }),
      ]);

    return res.json({
      announcements: announcements || [],
      upcomingRodeos: rodeos || [],
      sponsors: sponsors || [],
      featuredAthletes: featuredAthletes || [],
    });
  } catch (err) {
    console.error("HOME_API_ERROR", err);
    return res.status(200).json({
      announcements: [],
      upcomingRodeos: [],
      sponsors: [],
      featuredAthletes: [],
    });
  }
});

export default router;