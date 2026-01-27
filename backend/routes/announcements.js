// filepath: backend/routes/announcements.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/announcements
 * Public announcements
 * Optional filters:
 *  - ?published=true
 *  - ?seasonId=#
 *  - ?eventId=#
 */
router.get("/", async (req, res) => {
  const { published, seasonId, eventId } = req.query;

  const announcements = await prisma.announcement.findMany({
    where: {
      ...(published === "true" ? { published: true } : {}),
      ...(seasonId ? { seasonId: Number(seasonId) } : {}),
      ...(eventId ? { eventId: Number(eventId) } : {}),
    },
    orderBy: [
      { sortOrder: "asc" },
      { publishAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  res.json(announcements);
});

export default router;
