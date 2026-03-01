// filepath: backend/routes/admin/seasons.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { getCurrentTenant } from "../../utils/getTenant.js";

const router = express.Router();

/* ---------------- */
/* GET ALL SEASONS  */
/* ---------------- */
router.get("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const seasons = await prisma.season.findMany({
      where: { tenantId: tenant.id },
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
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { year, startDate, endDate, active } = req.body;

    if (!year || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const season = await prisma.season.create({
      data: {
        tenantId: tenant.id,
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
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);
    const { year, startDate, endDate, active } = req.body;

    const existing = await prisma.season.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
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
/* DELETE SEASON    */
/* ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);

    const season = await prisma.season.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!season) {
      return res.status(404).json({ error: "Season not found" });
    }

    const eventCount = await prisma.event.count({
      where: {
        seasonId: id,
        tenantId: tenant.id,
      },
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
