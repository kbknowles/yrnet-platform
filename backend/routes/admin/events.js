// filepath: backend/routes/admin/events.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ---------------- */
/* GET ALL EVENTS */
/* ---------------- */
router.get("/", async (req, res) => {
  const events = await prisma.event.findMany({
    include: {
      season: true,
      location: true,
      callInPolicy: true,
      contacts: true,
      scheduleItems: true,
    },
    orderBy: { startDate: "asc" },
  });

  res.json(events);
});

/* ---------------- */
/* GET EVENT BY ID */
/* ---------------- */
router.get("/:id", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      season: true,
      location: true,
      callInPolicy: true,
      contacts: true,
      scheduleItems: true,
    },
  });

  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

/* ---------------- */
/* CREATE EVENT */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      slug,
      startDate,
      endDate,
      seasonId,
      locationId,
      callInPolicyId,
      generalInfo,
      specials,
      isStateFinals,
      status,
    } = req.body;

    if (!name || !slug || !startDate || !endDate || !seasonId || !locationId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        seasonId: Number(seasonId),
        locationId: Number(locationId),
        callInPolicyId: callInPolicyId ? Number(callInPolicyId) : null,
        generalInfo: generalInfo || null,
        specials: specials || null,
        isStateFinals: Boolean(isStateFinals),
        status: status || "published",
      },
    });

    res.json(event);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

/* ---------------- */
/* UPDATE EVENT */
/* ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      slug,
      startDate,
      endDate,
      seasonId,
      locationId,
      callInPolicyId,
      generalInfo,
      specials,
      isStateFinals,
      status,
    } = req.body;

    if (!name || !slug || !startDate || !endDate || !seasonId || !locationId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const event = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        seasonId: Number(seasonId),
        locationId: Number(locationId),
        callInPolicyId: callInPolicyId ? Number(callInPolicyId) : null,
        generalInfo: generalInfo || null,
        specials: specials || null,
        isStateFinals: Boolean(isStateFinals),
        status,
      },
    });

    res.json(event);
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

/* ---------------- */
/* DELETE EVENT */
/* ---------------- */
router.delete("/:id", async (req, res) => {
  await prisma.event.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ success: true });
});

export default router;
