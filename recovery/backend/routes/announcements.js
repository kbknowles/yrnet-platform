// backend/routes/announcements.js
import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* --------------------------------
   GET ALL PUBLISHED ANNOUNCEMENTS
   (WITH EVENT SLUG FOR ROUTING)
---------------------------------- */
router.get("/", async (_req, res) => {
  const now = new Date();

  const items = await prisma.announcement.findMany({
    where: {
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
      event: {
        select: {
          id: true,
          name: true,
          slug: true, // REQUIRED for /schedule/[slug]
        },
      },
    },
  });

  res.json(items);
});

/* --------------------------------
   GET SINGLE ANNOUNCEMENT (OPTIONAL)
---------------------------------- */
router.get("/:id", async (req, res) => {
  const item = await prisma.announcement.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item || !item.published) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(item);
});

export default router;
