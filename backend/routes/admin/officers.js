// filepath: backend/routes/admin/officers.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET all officers (tenant scoped)
 * GET /api/:tenantSlug/admin/officers
 */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const officers = await prisma.officer.findMany({
      where: { tenantId: req.tenantId },
      include: { season: true },
      orderBy: { name: "asc" },
    });

    res.json(officers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE officer (tenant scoped)
 * POST /api/:tenantSlug/admin/officers
 */
router.post("/", resolveTenant, async (req, res) => {
  try {
    const seasonId = Number(req.body.seasonId);

    const season = await prisma.season.findFirst({
      where: { id: seasonId, tenantId: req.tenantId },
    });

    if (!season) {
      return res.status(400).json({ error: "Invalid season" });
    }

    const officer = await prisma.officer.create({
      data: {
        tenantId: req.tenantId,
        name: req.body.name,
        role: req.body.role,
        type: req.body.type,
        email: req.body.email || null,
        phone: req.body.phone || null,
        seasonId,
        active: req.body.active ?? true,
      },
    });

    res.json(officer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * UPDATE officer (tenant scoped)
 * PUT /api/:tenantSlug/admin/officers/:id
 */
router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.officer.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Officer not found" });
    }

    const seasonId = Number(req.body.seasonId);

    const season = await prisma.season.findFirst({
      where: { id: seasonId, tenantId: req.tenantId },
    });

    if (!season) {
      return res.status(400).json({ error: "Invalid season" });
    }

    const officer = await prisma.officer.update({
      where: { id },
      data: {
        name: req.body.name,
        role: req.body.role,
        type: req.body.type,
        email: req.body.email || null,
        phone: req.body.phone || null,
        seasonId,
        active: req.body.active,
      },
    });

    res.json(officer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE officer (tenant scoped)
 * DELETE /api/:tenantSlug/admin/officers/:id
 */
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.officer.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Officer not found" });
    }

    await prisma.officer.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;