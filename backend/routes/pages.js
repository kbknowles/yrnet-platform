// filepath: backend/routes/pages.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/* ------------------------------ */
/* GET ALL PUBLISHED PAGES */
/* GET /api/:tenantSlug/pages */
/* ------------------------------ */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
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

  res.json(pages);
});

/* ------------------------------ */
/* GET PAGE BY SLUG */
/* GET /api/:tenantSlug/pages/:slug */
/* ------------------------------ */
router.get("/:tenantSlug/:slug", resolveTenant, async (req, res) => {
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
});

export default router;