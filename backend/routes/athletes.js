// filepath: backend/routes/athletes.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/* ----------------------------
   GET ALL (PUBLIC)
   Active athletes only
----------------------------- */
router.get("/:tenantSlug", resolveTenant, async (req, res) => {
  const athletes = await prisma.athlete.findMany({
    where: {
      tenantId: req.tenantId,
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
  });

  res.json(athletes);
});

/* ----------------------------
   GET ONE BY SLUG (PUBLIC)
   Canonical: slug-only (within tenant)
----------------------------- */
router.get("/:tenantSlug/:slug", resolveTenant, async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Invalid athlete slug" });
  }

  const athlete = await prisma.athlete.findUnique({
    where: {
      slug_tenantId: {
        slug,
        tenantId: req.tenantId,
      },
    },
  });

  if (!athlete || !athlete.isActive) {
    return res.status(404).json({ error: "Athlete not found" });
  }

  res.json(athlete);
});

export default router;