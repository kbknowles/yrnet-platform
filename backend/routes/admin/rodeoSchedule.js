// filepath: backend/routes/admin/rodeoSchedule.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/**
 * GET /api/:tenantSlug/admin/rodeo-schedule-items/:rodeoId
 * Returns schedule items for a single rodeo (tenant scoped)
 */
router.get("/:tenantSlug/:rodeoId", resolveTenant, async (req, res) => {
  try {
    const rodeoId = Number(req.params.rodeoId);

    const rodeo = await prisma.rodeo.findFirst({
      where: { id: rodeoId, tenantId: req.tenantId },
    });

    if (!rodeo) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    const items = await prisma.rodeoScheduleItem.findMany({
      where: { rodeoId },
      orderBy: { startTime: "asc" },
    });

    return res.json(items || []);
  } catch (err) {
    console.error("ADMIN_RODEO_SCHEDULE_GET_ERROR", err);
    return res.status(500).json({ error: "Failed to load rodeo schedule" });
  }
});

/**
 * POST /api/:tenantSlug/admin/rodeo-schedule-items
 * Creates a schedule item (tenant scoped)
 */
router.post("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const { rodeoId, title, startTime, endTime, notes } = req.body;

    if (!rodeoId || !title || !startTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rodeo = await prisma.rodeo.findFirst({
      where: { id: Number(rodeoId), tenantId: req.tenantId },
    });

    if (!rodeo) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    const item = await prisma.rodeoScheduleItem.create({
      data: {
        rodeoId: Number(rodeoId),
        title,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        notes: notes || null,
      },
    });

    return res.json(item);
  } catch (err) {
    console.error("ADMIN_RODEO_SCHEDULE_CREATE_ERROR", err);
    return res.status(500).json({ error: "Failed to create rodeo schedule item" });
  }
});

/**
 * PUT /api/:tenantSlug/admin/rodeo-schedule-items/:id
 * Updates a schedule item (tenant scoped)
 */
router.put("/:tenantSlug/item/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, startTime, endTime, notes } = req.body;

    if (!title || !startTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.rodeoScheduleItem.findFirst({
      where: {
        id,
        rodeo: { tenantId: req.tenantId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Schedule item not found" });
    }

    const item = await prisma.rodeoScheduleItem.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        notes: notes || null,
      },
    });

    return res.json(item);
  } catch (err) {
    console.error("ADMIN_RODEO_SCHEDULE_UPDATE_ERROR", err);
    return res.status(500).json({ error: "Failed to update rodeo schedule item" });
  }
});

/**
 * DELETE /api/:tenantSlug/admin/rodeo-schedule-items/:id
 * Deletes a schedule item (tenant scoped)
 */
router.delete("/:tenantSlug/item/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.rodeoScheduleItem.findFirst({
      where: {
        id,
        rodeo: { tenantId: req.tenantId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Schedule item not found" });
    }

    await prisma.rodeoScheduleItem.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("ADMIN_RODEO_SCHEDULE_DELETE_ERROR", err);
    return res.status(500).json({ error: "Failed to delete rodeo schedule item" });
  }
});

export default router;