// filepath: backend/routes/admin/athletes.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ----------------------------
   GET ALL (ADMIN)
----------------------------- */
router.get("/", async (_req, res) => {
  const athletes = await prisma.athlete.findMany({
    orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
    include: { season: true },
  });

  res.json(athletes);
});

/* ----------------------------
   GET ONE BY SLUG (ADMIN)
----------------------------- */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Invalid athlete slug" });
  }

  const athlete = await prisma.athlete.findUnique({
    where: { slug },
  });

  if (!athlete) {
    return res.status(404).json({ error: "Athlete not found" });
  }

  res.json(athlete);
});

/* ----------------------------
   CREATE (ADMIN)
----------------------------- */
router.post("/", async (req, res) => {
  const activeSeason = await prisma.season.findFirst({
    where: { active: true },
  });

  if (!activeSeason) {
    return res.status(400).json({ error: "No active season found" });
  }

  if (!req.body.slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const athlete = await prisma.athlete.create({
    data: {
      ...req.body,
      seasonId: activeSeason.id,
    },
  });

  res.json(athlete);
});

/* ----------------------------
   UPDATE BY SLUG (ADMIN)
----------------------------- */
router.put("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Invalid athlete slug" });
  }

  const athlete = await prisma.athlete.update({
    where: { slug },
    data: req.body,
  });

  res.json(athlete);
});

/* ----------------------------
   DELETE BY SLUG (ADMIN)
----------------------------- */
router.delete("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Invalid athlete slug" });
  }

  await prisma.athlete.delete({
    where: { slug },
  });

  res.json({ ok: true });
});

export default router;
