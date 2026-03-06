// filepath: backend/routes/admin/locations.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ---------------- */
/* GET ALL LOCATIONS (Tenant Scoped) */
/* GET /api/:tenantSlug/admin/locations */
/* ---------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { name: "asc" },
    });

    return res.json(locations || []);
  } catch (err) {
    console.error("ADMIN_LOCATIONS_GET_ALL_ERROR", err);
    return res.status(500).json({ error: "Failed to load locations" });
  }
});

/* ---------------- */
/* CREATE LOCATION (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/locations */
/* ---------------- */
router.post("/", resolveTenant, async (req, res) => {
  try {
    const { name, streetAddress, city, state, zip, venueInfo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const location = await prisma.location.create({
      data: {
        tenantId: req.tenantId,
        name,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        venueInfo: venueInfo || {},
      },
    });

    return res.json(location);
  } catch (err) {
    console.error("ADMIN_LOCATIONS_CREATE_ERROR", err);
    return res.status(500).json({ error: "Failed to create location" });
  }
});

/* ---------------- */
/* UPDATE LOCATION (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/locations/:id */
/* ---------------- */
router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, streetAddress, city, state, zip, venueInfo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existing = await prisma.location.findFirst({
      where: { id, tenantId: req.tenantId },
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

    return res.json(location);
  } catch (err) {
    console.error("ADMIN_LOCATIONS_UPDATE_ERROR", err);
    return res.status(500).json({ error: "Failed to update location" });
  }
});

/* ---------------- */
/* DELETE LOCATION (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/locations/:id */
/* ---------------- */
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.location.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Location not found" });
    }

    const rodeoCount = await prisma.rodeo.count({
      where: { locationId: id, tenantId: req.tenantId },
    });

    if (rodeoCount > 0) {
      return res.status(409).json({
        error:
          "This location cannot be deleted because it is assigned to one or more rodeos.",
      });
    }

    await prisma.location.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("ADMIN_LOCATIONS_DELETE_ERROR", err);
    return res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;