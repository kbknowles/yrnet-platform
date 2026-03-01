// filepath: backend/routes/admin/eventScheduleItems.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { getCurrentTenant } from "../../utils/getTenant.js";

const router = express.Router();

/* ---------------- */
/* GET SCHEDULE ITEMS BY EVENT ID */
/* ---------------- */
router.get("/:eventId", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const eventId = Number(req.params.eventId);

    // Ensure event belongs to tenant
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        tenantId: tenant.id,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const items = await prisma.eventScheduleItem.findMany({
      where: { eventId },
      orderBy: { date: "asc" },
    });

    res.json(items);
  } catch (error) {
    console.error("GET SCHEDULE ITEMS ERROR:", error);
    res.status(500).json({ error: "Failed to load schedule items" });
  }
});

/* ---------------- */
/* CREATE SCHEDULE ITEM */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { eventId, label, date, startTime, notes } = req.body;

    if (!eventId || !label || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure event belongs to tenant
    const event = await prisma.event.findFirst({
      where: {
        id: Number(eventId),
        tenantId: tenant.id,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const item = await prisma.eventScheduleItem.create({
      data: {
        eventId: Number(eventId),
        label,
        date: new Date(date),
        startTime: startTime || null,
        notes: notes || null,
      },
    });

    res.json(item);
  } catch (error) {
    console.error("CREATE SCHEDULE ITEM ERROR:", error);
    res.status(500).json({ error: "Failed to create schedule item" });
  }
});

export default router;
