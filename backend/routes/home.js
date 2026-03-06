// filepath: backend/routes/home.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

/*
  CRITICAL:
  mergeParams: true allows :tenantSlug
  from the parent router to be available here.
*/
const router = express.Router({ mergeParams: true });

/**
 * GET /:tenantSlug/home
 */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const now = new Date();
    const tenantId = req.tenantId;

    const [tenant, announcements, rodeos, sponsors, featuredAthletes] =
      await Promise.all([
        prisma.tenant.findUnique({
          where: { id: tenantId },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            theme: true,
          },
        }),

        prisma.announcement.findMany({
          where: {
            tenantId,
            published: true,
            AND: [
              { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
              { OR: [{ expireAt: null }, { expireAt: { gte: now } }] },
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
          where: { tenantId, status: "published" },
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
          where: { tenantId, active: true },
          orderBy: { createdAt: "desc" },
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
      tenant,
      announcements,
      upcomingRodeos: rodeos,
      sponsors,
      featuredAthletes,
    });
  } catch (err) {
    console.error("HOME_API_ERROR", err);
    return res.status(500).json({
      tenant: null,
      announcements: [],
      upcomingRodeos: [],
      sponsors: [],
      featuredAthletes: [],
    });
  }
});

export default router;