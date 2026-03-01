// filepath: backend/routes/admin/locations.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { getCurrentTenant } from "../../utils/getTenant.js";

const router = express.Router();

/* ---------------- */
/* GET ALL LOCATIONS */
/* ---------------- */
router.get("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const locations = await prisma.location.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
    });

    res.json(locations);
  } catch (err) {
    console.error("GET /locations failed", err);
    res.status(500).json({ error: "Failed to load locations" });
  }
});

/* ---------------- */
/* CREATE LOCATION  */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { name, streetAddress, city, state, zip, venueInfo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const location = await prisma.location.create({
      data: {
        tenantId: tenant.id,
        name,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        venueInfo: venueInfo || {},
      },
    });

    res.json(location);
  } catch (err) {
    console.error("POST /locations failed", err);
    res.status(500).json({ error: "Failed to create location" });
  }
});

/* ---------------- */
/* UPDATE LOCATION  */
/* ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);
    const { name, streetAddress, city, state, zip, venueInfo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existing = await prisma.location.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Location not found" });
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        name,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        venueInfo: venueInfo || {},
      },
    });

    res.json(location);
  } catch (err) {
    console.error("PUT /locations failed", err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

/* ---------------- */
/* DELETE LOCATION  */
/* ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);

    const location = await prisma.location.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const eventCount = await prisma.event.count({
      where: {
        locationId: id,
        tenantId: tenant.id,
      },
    });

    if (eventCount > 0) {
      return res.status(409).json({
        error:
          "This location cannot be deleted because it is assigned to one or more events.",
      });
    }

    await prisma.location.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /locations failed", err);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;
