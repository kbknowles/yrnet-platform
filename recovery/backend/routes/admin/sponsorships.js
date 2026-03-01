import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ==============================
   GET ALL
============================== */
router.get("/", async (req, res) => {
  try {
    const items = await prisma.sponsorship.findMany({
      include: { sponsor: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

/* ==============================
   GET ONE
============================== */
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.sponsorship.findUnique({
      where: { id: Number(req.params.id) },
      include: { sponsor: true },
    });

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sponsorship" });
  }
});

/* ==============================
   CREATE
============================== */
router.post("/", async (req, res) => {
  try {
    const {
      sponsorId,
      level,
      startDate,
      endDate,
      contentType,
      contentId,
      priority,
      active,
    } = req.body;

    const created = await prisma.sponsorship.create({
      data: {
        sponsorId: Number(sponsorId),
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        contentType: contentType || null,
        contentId: contentId ? Number(contentId) : null,
        priority: priority ?? 0,
        active: active ?? true,
      },
    });

    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create sponsorship" });
  }
});

/* ==============================
   UPDATE
============================== */
router.put("/:id", async (req, res) => {
  try {
    const {
      level,
      startDate,
      endDate,
      contentType,
      contentId,
      priority,
      active,
    } = req.body;

    const updated = await prisma.sponsorship.update({
      where: { id: Number(req.params.id) },
      data: {
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        contentType: contentType || null,
        contentId: contentId ? Number(contentId) : null,
        priority: priority ?? 0,
        active: active ?? true,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update sponsorship" });
  }
});

/* ==============================
   DELETE
============================== */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.sponsorship.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete sponsorship" });
  }
});

export default router;
