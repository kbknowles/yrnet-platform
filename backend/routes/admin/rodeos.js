// filepath: backend/routes/admin/rodeos.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ---------------- */
/* GET ALL RODEOS (Tenant Scoped) */
/* GET /:tenantSlug/admin/rodeos */
/* ---------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const rodeos = await prisma.rodeo.findMany({
      where: { tenantId: req.tenantId },
      include: {
        season: true,
        location: true,
        callInPolicy: true,
        contacts: true,
        scheduleItems: true,
      },
      orderBy: { startDate: "asc" },
    });

    return res.json(rodeos || []);
  } catch (err) {
    console.error("GET_RODEOS_ERROR", err);
    return res.status(500).json({ error: "Failed to load rodeos" });
  }
});

/* ---------------- */
/* GET RODEO BY SLUG (Tenant Scoped) */
/* GET /:tenantSlug/admin/rodeos/:slug */
/* ---------------- */
router.get("/:slug", resolveTenant, async (req, res) => {
  try {
    const rodeo = await prisma.rodeo.findFirst({
      where: {
        slug: req.params.slug,
        tenantId: req.tenantId,
      },
      include: {
        season: true,
        location: true,
        callInPolicy: true,
        contacts: true,
        scheduleItems: true,
      },
    });

    if (!rodeo) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    return res.json(rodeo);
  } catch (err) {
    console.error("GET_RODEO_ERROR", err);
    return res.status(500).json({ error: "Failed to load rodeo" });
  }
});

/* ---------------- */
/* CREATE RODEO (Tenant Scoped) */
/* POST /:tenantSlug/admin/rodeos */
/* ---------------- */
router.post("/", resolveTenant, async (req, res) => {
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
      return res.status(400).json({ error: "Missing required fields" });
    }

    const season = await prisma.season.findFirst({
      where: { id: Number(seasonId), tenantId: req.tenantId },
    });

    const location = await prisma.location.findFirst({
      where: { id: Number(locationId), tenantId: req.tenantId },
    });

    if (!season || !location) {
      return res.status(400).json({ error: "Invalid season or location" });
    }

    const rodeo = await prisma.rodeo.create({
      data: {
        tenantId: req.tenantId,
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

    return res.json(rodeo);
  } catch (err) {
    console.error("CREATE_RODEO_ERROR", err);
    return res.status(500).json({ error: "Failed to create rodeo" });
  }
});

/* ---------------- */
/* UPDATE RODEO (Tenant Scoped) */
/* PUT /:tenantSlug/admin/rodeos/:slug */
/* ---------------- */
router.put("/:slug", resolveTenant, async (req, res) => {
  try {
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

    const existing = await prisma.rodeo.findFirst({
      where: { slug: req.params.slug, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    const rodeo = await prisma.rodeo.update({
      where: { id: existing.id },
      data: {
        name: name ?? existing.name,
        slug: newSlug ?? existing.slug,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        seasonId: seasonId ? Number(seasonId) : existing.seasonId,
        locationId: locationId ? Number(locationId) : existing.locationId,
        callInPolicyId:
          callInPolicyId !== undefined
            ? callInPolicyId
              ? Number(callInPolicyId)
              : null
            : existing.callInPolicyId,
        generalInfo:
          generalInfo !== undefined ? generalInfo : existing.generalInfo,
        specials: specials !== undefined ? specials : existing.specials,
        isStateFinals:
          isStateFinals !== undefined
            ? Boolean(isStateFinals)
            : existing.isStateFinals,
        status: status ?? existing.status,
      },
    });

    return res.json(rodeo);
  } catch (err) {
    console.error("UPDATE_RODEO_ERROR", err);
    return res.status(500).json({ error: "Failed to update rodeo" });
  }
});

/* ---------------- */
/* DELETE RODEO (Tenant Scoped) */
/* DELETE /:tenantSlug/admin/rodeos/:slug */
/* ---------------- */
router.delete("/:slug", resolveTenant, async (req, res) => {
  try {
    const existing = await prisma.rodeo.findFirst({
      where: { slug: req.params.slug, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    await prisma.rodeo.delete({
      where: { id: existing.id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE_RODEO_ERROR", err);
    return res.status(500).json({ error: "Failed to delete rodeo" });
  }
});

export default router;