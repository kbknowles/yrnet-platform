// filepath: backend/routes/admin/announcements.mjs

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* -------------------------------- */
/* GET ALL ANNOUNCEMENTS             */
/* -------------------------------- */
router.get("/", async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Failed to load announcements" });
  }
});

/* -------------------------------- */
/* CREATE ANNOUNCEMENT               */
/* -------------------------------- */
router.post("/", async (req, res) => {
  try {
    const {
      eventId,
      seasonId,
      title,
      content,
      type,
      sortOrder = 0,
      extras,
      published = false,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        eventId: eventId ? Number(eventId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        title,
        content,
        type,
        sortOrder: Number(sortOrder) || 0,
        extras,
        published: Boolean(published),
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

/* -------------------------------- */
/* UPDATE ANNOUNCEMENT               */
/* -------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const {
      eventId,
      seasonId,
      title,
      content,
      type,
      sortOrder,
      extras,
      published,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id: Number(req.params.id) },
      data: {
        eventId: eventId !== undefined ? (eventId ? Number(eventId) : null) : undefined,
        seasonId: seasonId !== undefined ? (seasonId ? Number(seasonId) : null) : undefined,
        title,
        content,
        type,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        extras,
        published: published !== undefined ? Boolean(published) : undefined,
        publishAt: publishAt !== undefined ? (publishAt ? new Date(publishAt) : null) : undefined,
        expireAt: expireAt !== undefined ? (expireAt ? new Date(expireAt) : null) : undefined,
      },
    });

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: "Failed to update announcement" });
  }
});

/* -------------------------------- */
/* DELETE ANNOUNCEMENT               */
/* -------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.announcement.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export default router;
