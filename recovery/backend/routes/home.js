// filepath: backend/routes/home.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

const router = express.Router();

/**
 * GET /api/home
 * Returns upcoming rodeos + announcements for the home page (tenant scoped)
 */
router.get("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const now = new Date();

    const [rodeos, announcements] = await Promise.all([
      prisma.event.findMany({
        where: {
          tenantId: tenant.id,
          status: "published",
          startDate: { gte: now },
          season: {
            active: true,
            tenantId: tenant.id,
          },
        },
        orderBy: { startDate: "asc" },
        take: 3,
        include: {
          location: true,
        },
      }),

      prisma.announcement.findMany({
        where: {
          tenantId: tenant.id,
          published: true,
          season: {
            active: true,
            tenantId: tenant.id,
          },
          OR: [
            { expireAt: null },
            { expireAt: { gt: now } },
          ],
          AND: [
            {
              OR: [
                { publishAt: null },
                { publishAt: { lte: now } },
              ],
            },
          ],
        },
        orderBy: [
          { sortOrder: "asc" },
          { publishAt: "desc" },
        ],
        take: 3,
      }),
    ]);

    res.json({
      rodeos,
      announcements,
    });
  } catch (error) {
    console.error("HOME_API_ERROR", error);
    res.status(500).json({ error: "Failed to load home data" });
  }
});

export default router;
