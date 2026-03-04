// filepath: backend/routes/admin/seasons.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router();

/* ---------------- */
/* GET ALL SEASONS (Tenant Scoped) */
/* GET /api/:tenantSlug/admin/seasons */
/* ---------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { startDate: "desc" },
    });

    res.json(seasons || []);
  } catch (err) {
    console.error("GET /seasons failed", err);
    res.status(500).json({ error: "Failed to load seasons" });
  }
});

/* ---------------- */
/* CREATE SEASON (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/seasons */
/* ---------------- */
router.post("/", resolveTenant, async (req, res) => {
  try {
    const { year, startDate, endDate, active } = req.body;

    if (!year || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const season = await prisma.season.create({
      data: {
        tenantId: req.tenantId,
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
/* UPDATE SEASON (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/seasons/:id */
/* ---------------- */
router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { year, startDate, endDate, active } = req.body;

    const existing = await prisma.season.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Season not found" });
    }

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
/* DELETE SEASON (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/seasons/:id */
/* ---------------- */
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.season.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Season not found" });
    }

    const rodeoCount = await prisma.rodeo.count({
      where: { seasonId: id, tenantId: req.tenantId },
    });

    if (rodeoCount > 0) {
      return res.status(409).json({
        error: "Cannot delete season with linked rodeos",
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