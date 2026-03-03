// filepath: backend/routes/admin/pages.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router();

/* ------------------------------ */
/* GET ALL PAGES (Tenant Scoped) */
/* GET /api/:tenantSlug/admin/pages */
/* ------------------------------ */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const pages = await prisma.customPage.findMany({
      where: { tenantId: req.tenantId },
      orderBy: [
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
    });

    res.json(pages);
  } catch (err) {
    console.error("ADMIN_PAGES_GET_ERROR", err);
    res.status(500).json({ error: "Failed to load pages" });
  }
});

/* ------------------------------ */
/* CREATE PAGE (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/pages */
/* ------------------------------ */
router.post("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      status,
      showInMenu,
      showInFooter,
      sortOrder,
      isPlaceholder,
      layoutType,
      sections,
      heroImage,
      heroSubtitle,
    } = req.body;

    const page = await prisma.customPage.create({
      data: {
        tenantId: req.tenantId,
        title,
        slug,
        content,
        status,
        showInMenu: Boolean(showInMenu),
        showInFooter: Boolean(showInFooter),
        sortOrder: Number(sortOrder) || 0,
        isPlaceholder: Boolean(isPlaceholder),
        layoutType: layoutType || "standard",
        sections,
        heroImage,
        heroSubtitle,
      },
    });

    res.json(page);
  } catch (err) {
    console.error("ADMIN_PAGES_CREATE_ERROR", err);
    res.status(500).json({ error: "Failed to create page" });
  }
});

/* ------------------------------ */
/* UPDATE PAGE (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/pages/:id */
/* ------------------------------ */
router.put("/:tenantSlug/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.customPage.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Page not found" });
    }

    const {
      title,
      slug,
      content,
      status,
      showInMenu,
      showInFooter,
      sortOrder,
      isPlaceholder,
      layoutType,
      sections,
      heroImage,
      heroSubtitle,
    } = req.body;

    const page = await prisma.customPage.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        status,
        showInMenu: Boolean(showInMenu),
        showInFooter: Boolean(showInFooter),
        sortOrder: Number(sortOrder) || 0,
        isPlaceholder: Boolean(isPlaceholder),
        layoutType,
        sections,
        heroImage,
        heroSubtitle,
      },
    });

    res.json(page);
  } catch (err) {
    console.error("ADMIN_PAGES_UPDATE_ERROR", err);
    res.status(500).json({ error: "Failed to update page" });
  }
});

/* ------------------------------ */
/* DELETE PAGE (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/pages/:id */
/* ------------------------------ */
router.delete("/:tenantSlug/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.customPage.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Page not found" });
    }

    await prisma.customPage.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN_PAGES_DELETE_ERROR", err);
    res.status(500).json({ error: "Failed to delete page" });
  }
});

export default router;