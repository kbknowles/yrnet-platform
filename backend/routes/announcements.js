// filepath: backend/routes/announcements.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/announcements
 * Public announcements
 *
 * Query params:
 *  - seasonId=#
 *  - eventId=#
 *
 * Public rules (enforced):
 *  - published = true
 *  - publishAt <= now OR publishAt is null
 *  - expireAt  > now OR expireAt is null
 */
router.get("/", async (req, res) => {
  try {
    const { seasonId, eventId } = req.query;
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        published: true,

        ...(seasonId ? { seasonId: Number(seasonId) } : {}),
        ...(eventId ? { eventId: Number(eventId) } : {}),

        AND: [
          {
            OR: [
              { publishAt: null },
              { publishAt: { lte: now } },
            ],
          },
          {
            OR: [
              { expireAt: null },
              { expireAt: { gt: now } },
            ],
          },
        ],
      },
      orderBy: [
        { sortOrder: "asc" },
        { publishAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Failed to load announcements" });
  }
});

export default router;
