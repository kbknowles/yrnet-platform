// filepath: backend/routes/admin/settings.js

/*
  Tenant Settings Routes
  ------------------------------------------------------
  Handles CRUD operations for tenant configuration.

  Includes:
  - Basic tenant settings (name, domain, colors, active)
  - Hero section configuration
  - Logo upload
  - Hero image upload

  Media storage pattern:
  /uploads/tenants/{tenantSlug}/images/{filename}

  Only the filename is stored in the database.
*/

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

        /* branding */
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,

        /* media */
        logoUrl: true,
        heroImageUrl: true,

        /* hero content */
        heroTitle: true,
        heroSubtitle: true,
        heroCtaText: true,
        heroCtaLink: true,
        heroEnabled: true,

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

      heroTitle,
      heroSubtitle,
      heroCtaText,
      heroCtaLink,
      heroEnabled,

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

        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroCtaText: heroCtaText || null,
        heroCtaLink: heroCtaLink || null,
        heroEnabled:
          heroEnabled === undefined ? undefined : Boolean(heroEnabled),

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
        heroImageUrl: true,

        heroTitle: true,
        heroSubtitle: true,
        heroCtaText: true,
        heroCtaLink: true,
        heroEnabled: true,

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
  uploadImage.single("logo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      /*
        Store only the filename.
        The frontend will resolve the full URL using resolveTenantMedia().
      */

      const updated = await prisma.tenant.update({
        where: { id: req.tenantId },
        data: {
          logoUrl: req.file.filename,
        },
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

/* ---------------- */
/* UPLOAD HERO IMAGE */
/* POST /:tenantSlug/admin/settings/hero */
/* ---------------- */

router.post(
  "/hero",
  resolveTenant,
  uploadImage.single("hero"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      /*
        Store only the filename for the hero image.
        Actual URL will resolve via:

        resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: heroImageUrl
        })
      */

      const updated = await prisma.tenant.update({
        where: { id: req.tenantId },
        data: {
          heroImageUrl: req.file.filename,
        },
        select: {
          heroImageUrl: true,
        },
      });

      return res.json({
        success: true,
        heroImageUrl: updated.heroImageUrl,
      });
    } catch (err) {
      console.error("ADMIN_SETTINGS_HERO_UPLOAD_ERROR", err);
      return res.status(500).json({ error: "Failed to upload hero image" });
    }
  }
);

export default router;