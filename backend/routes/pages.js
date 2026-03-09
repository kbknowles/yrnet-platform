// filepath: backend/routes/pages.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ------------------------------ */
/* GET ALL PUBLISHED PAGES */
/* GET /:tenantSlug/pages */
/* ------------------------------ */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const pages = await prisma.customPage.findMany({
      where: {
        tenantId: req.tenantId,
        status: "published",
      },
      orderBy: { sortOrder: "asc" },
      select: {
        title: true,
        slug: true,
        heroSubtitle: true,
        showInMenu: true,
        showInFooter: true,
        sortOrder: true,
        isPlaceholder: true,
      },
    });

    res.json(pages || []);
  } catch (err) {
    console.error("PUBLIC_PAGES_ERROR", err);
    res.status(200).json([]);
  }
});

/* ------------------------------ */
/* GET PAGE BY SLUG */
/* GET /:tenantSlug/pages/:slug */
/* ------------------------------ */
router.get("/:slug", resolveTenant, async (req, res) => {
  try {
    const page = await prisma.customPage.findFirst({
      where: {
        tenantId: req.tenantId,
        slug: req.params.slug,
        status: "published",
      },
    });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    console.error("PUBLIC_PAGE_ERROR", err);
    res.status(500).json({ error: "Failed to load page" });
  }
});

export default router;