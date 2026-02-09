import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* GET ALL */
router.get("/", async (_req, res) => {
  const items = await prisma.announcement.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(items);
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const {
      eventId,
      seasonId,
      title,
      content,
      type,
      mode = "STANDARD",
      imageUrl,
      sortOrder = 0,
      extras,
      published = false,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        mode,
        type,
        content: mode === "POSTER" ? "" : content,
        imageUrl: imageUrl || null,
        sortOrder: Number(sortOrder) || 0,
        extras,
        published: Boolean(published),
        eventId: eventId ? Number(eventId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create announcement" });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      mode,
      imageUrl,
      sortOrder,
      extras,
      published,
      eventId,
      seasonId,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        type,
        mode,
        content: mode === "POSTER" ? "" : content,
        imageUrl,
        sortOrder,
        extras,
        published,
        eventId: eventId ? Number(eventId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update announcement" });
  }
});

router.delete("/:id", async (req, res) => {
  await prisma.announcement.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ ok: true });
});

export default router;
