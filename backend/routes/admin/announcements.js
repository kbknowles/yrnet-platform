import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* -------------------------------- */
/* GET ALL ANNOUNCEMENTS             */
/* -------------------------------- */
router.get("/", async (_req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json(announcements);
  } catch {
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
      mode = "STANDARD", // STANDARD | POSTER
      imageUrl,
      sortOrder = 0,
      extras,
      published = false,
      publishAt,
      expireAt,
    } = req.body;

    // Validation
    if (mode === "POSTER" && !imageUrl) {
      return res.status(400).json({ error: "Poster requires imageUrl" });
    }

    if (mode === "STANDARD" && !content) {
      return res.status(400).json({ error: "Content required" });
    }

    const announcement = await prisma.announcement.create({
      data: {
        eventId: eventId ? Number(eventId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        title,
        content: mode === "POSTER" ? null : content,
        mode,
        imageUrl: imageUrl || null,
        sortOrder: Number(sortOrder) || 0,
        extras,
        published: Boolean(published),
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    res.json(announcement);
  } catch {
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
      mode,
      imageUrl,
      sortOrder,
      extras,
      published,
      publishAt,
      expireAt,
    } = req.body;

    if (mode === "POSTER" && imageUrl === null) {
      return res.status(400).json({ error: "Poster requires imageUrl" });
    }

    const announcement = await prisma.announcement.update({
      where: { id: Number(req.params.id) },
      data: {
        eventId:
          eventId !== undefined ? (eventId ? Number(eventId) : null) : undefined,
        seasonId:
          seasonId !== undefined ? (seasonId ? Number(seasonId) : null) : undefined,
        title,
        mode,
        imageUrl,
        content: mode === "POSTER" ? null : content,
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) : undefined,
        extras,
        published:
          published !== undefined ? Boolean(published) : undefined,
        publishAt:
          publishAt !== undefined
            ? publishAt
              ? new Date(publishAt)
              : null
            : undefined,
        expireAt:
          expireAt !== undefined
            ? expireAt
              ? new Date(expireAt)
              : null
            : undefined,
      },
    });

    res.json(announcement);
  } catch {
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
  } catch {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export default router;
