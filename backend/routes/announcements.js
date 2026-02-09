// backend/routes/announcements.js
import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

router.get("/", async (_req, res) => {
  const now = new Date();

  const items = await prisma.announcement.findMany({
    where: {
      published: true,
      OR: [{ publishAt: null }, { publishAt: { lte: now } }],
      OR: [{ expireAt: null }, { expireAt: { gte: now } }],
    },
    orderBy: [{ sortOrder: "asc" }, { publishAt: "desc" }],
  });

  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await prisma.announcement.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!item || !item.published) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(item);
});

export default router;
