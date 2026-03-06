// filepath: backend/routes/athletes.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ----------------------------
   GET ALL (PUBLIC)
   Active athletes only
GET /:tenantSlug/athletes
----------------------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const athletes = await prisma.athlete.findMany({
      where: {
        tenantId: req.tenantId,
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
    });

    res.json(athletes || []);
  } catch (err) {
    console.error("PUBLIC_ATHLETES_ERROR", err);
    res.status(200).json([]);
  }
});

/* ----------------------------
   GET ONE BY SLUG (PUBLIC)
GET /:tenantSlug/athletes/:slug
----------------------------- */
router.get("/:slug", resolveTenant, async (req, res) => {
  try {
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
  } catch (err) {
    console.error("PUBLIC_ATHLETE_ERROR", err);
    res.status(500).json({ error: "Failed to load athlete" });
  }
});

export default router;