// filepath: backend/routes/admin/events.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { getCurrentTenant } from "../../utils/getTenant.js";

const router = express.Router();

/* ---------------- */
/* GET ALL EVENTS  */
/* ---------------- */
router.get("/", async (_req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const events = await prisma.event.findMany({
      where: { tenantId: tenant.id },
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
  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    res.status(500).json({ error: "Failed to load events" });
  }
});

/* ---------------- */
/* GET EVENT BY SLUG */
/* ---------------- */
router.get("/:slug", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const event = await prisma.event.findFirst({
      where: {
        slug: req.params.slug,
        tenantId: tenant.id,
      },
      include: {
        season: true,
        location: true,
        callInPolicy: true,
        contacts: true,
        scheduleItems: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("GET EVENT ERROR:", err);
    res.status(500).json({ error: "Failed to load event" });
  }
});

/* ---------------- */
/* CREATE EVENT */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

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
        tenantId: tenant.id,
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
/* UPDATE EVENT (BY SLUG) */
/* ---------------- */
router.put("/:slug", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const {
      name,
      slug: newSlug,
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

    if (!name || !newSlug || !startDate || !endDate || !seasonId || !locationId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const event = await prisma.event.updateMany({
      where: {
        slug: req.params.slug,
        tenantId: tenant.id,
      },
      data: {
        name,
        slug: newSlug,
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

    if (event.count === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

/* ---------------- */
/* DELETE EVENT (BY SLUG) */
/* ---------------- */
router.delete("/:slug", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const result = await prisma.event.deleteMany({
      where: {
        slug: req.params.slug,
        tenantId: tenant.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
