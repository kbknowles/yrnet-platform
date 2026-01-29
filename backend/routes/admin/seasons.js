// filepath: backend/routes/admin/seasons.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ---------------- */
/* GET ALL SEASONS  */
/* ---------------- */
router.get("/", async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });

    res.json(seasons);
  } catch (err) {
    console.error("GET /seasons failed", err);
    res.status(500).json({ error: "Failed to load seasons" });
  }
});

/* ---------------- */
/* CREATE SEASON    */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const { year, startDate, endDate, active } = req.body;

    if (!year || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const season = await prisma.season.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active: Boolean(active),
      },
    });

    res.json(season);
  } catch (err) {
    console.error("POST /seasons failed", err);
    res.status(500).json({ error: "Failed to create season" });
  }
});

/* ---------------- */
/* UPDATE SEASON    */
/* ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { year, startDate, endDate, active } = req.body;

    const season = await prisma.season.update({
      where: { id },
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active: Boolean(active),
      },
    });

    res.json(season);
  } catch (err) {
    console.error("PUT /seasons failed", err);
    res.status(500).json({ error: "Failed to update season" });
  }
});

/* ---------------- */
/* DELETE SEASON    */
/* ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const eventCount = await prisma.event.count({
      where: { seasonId: id },
    });

    if (eventCount > 0) {
      return res.status(409).json({
        error: "Cannot delete season with linked events",
      });
    }

    await prisma.season.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /seasons failed", err);
    res.status(500).json({ error: "Failed to delete season" });
  }
});

export default router;
