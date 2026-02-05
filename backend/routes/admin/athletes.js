import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ----------------------------
   GET ALL
----------------------------- */
router.get("/", async (_, res) => {
  const athletes = await prisma.athlete.findMany({
    orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
    include: { season: true },
  });
  res.json(athletes);
});

/* ----------------------------
   GET ONE
----------------------------- */
router.get("/:id", async (req, res) => {
  const athlete = await prisma.athlete.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(athlete);
});

/* ----------------------------
   CREATE
----------------------------- */
router.post("/", async (req, res) => {
  // 🔒 Always attach active season
  const activeSeason = await prisma.season.findFirst({
    where: { active: true },
  });

  if (!activeSeason) {
    return res.status(400).json({
      error: "No active season found",
    });
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
   UPDATE
----------------------------- */
router.put("/:id", async (req, res) => {
  const athlete = await prisma.athlete.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });

  res.json(athlete);
});

/* ----------------------------
   DELETE
----------------------------- */
router.delete("/:id", async (req, res) => {
  await prisma.athlete.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ ok: true });
});

export default router;
