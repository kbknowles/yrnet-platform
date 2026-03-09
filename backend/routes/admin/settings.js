// filepath: backend/routes/admin/settings.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import uploadImage from "../../middleware/uploadImage.js";

const router = express.Router({ mergeParams: true });

/* ---------------- */
/* GET TENANT SETTINGS */
/* GET /:tenantSlug/admin/settings */
/* ---------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        logoUrl: true,
        active: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    return res.json(tenant);
  } catch (err) {
    console.error("ADMIN_SETTINGS_GET_ERROR", err);
    return res.status(500).json({ error: "Failed to load tenant settings" });
  }
});

/* ---------------- */
/* UPDATE TENANT SETTINGS */
/* PUT /:tenantSlug/admin/settings */
/* ---------------- */
router.put("/", resolveTenant, async (req, res) => {
  try {
    const {
      name,
      domain,
      primaryColor,
      secondaryColor,
      accentColor,
      active,
    } = req.body;

    const updated = await prisma.tenant.update({
      where: { id: req.tenantId },
      data: {
        name: name || undefined,
        domain: domain || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        accentColor: accentColor || null,
        active: active === undefined ? undefined : Boolean(active),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        logoUrl: true,
        active: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error("ADMIN_SETTINGS_UPDATE_ERROR", err);
    return res.status(500).json({ error: "Failed to update tenant settings" });
  }
});

/* ---------------- */
/* UPLOAD LOGO */
/* POST /:tenantSlug/admin/settings/logo */
/* ---------------- */
router.post(
  "/logo",
  resolveTenant,
  uploadImage.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const tenantSlug = req.params.tenantSlug;

      const logoUrl = `/uploads/tenants/${tenantSlug}/images/${req.file.filename}`;

      const updated = await prisma.tenant.update({
        where: { id: req.tenantId },
        data: { logoUrl },
        select: {
          logoUrl: true,
        },
      });

      return res.json({
        success: true,
        logoUrl: updated.logoUrl,
      });
    } catch (err) {
      console.error("ADMIN_SETTINGS_LOGO_UPLOAD_ERROR", err);
      return res.status(500).json({ error: "Failed to upload logo" });
    }
  }
);

export default router;