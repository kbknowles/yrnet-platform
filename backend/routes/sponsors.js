// filepath: backend/routes/sponsors.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router();

/**
 * ===============================
 * GET PUBLIC SPONSORS (tenant-scoped)
 * GET /api/:tenantSlug/sponsors
 * ===============================
 */

router.get("/", resolveTenant, async (req, res) => {
  try {
    const sponsorships = await prisma.$queryRaw`
      SELECT 
        sp.id AS "sponsorshipId",
        sp."contentType",
        sp."level",
        sp.active,
        s.id AS "sponsorId",
        s.name,
        s."logoUrl",
        s."bannerUrl",
        s.website,
        s.description
      FROM "Sponsorship" sp
      JOIN "Sponsor" s ON s.id = sp."sponsorId"
      WHERE 
        sp.active = true
        AND s.active = true
        AND s."tenantId" = ${req.tenantId}
      ORDER BY
        CASE 
          WHEN sp."contentType" IS NULL THEN 1
          WHEN sp."contentType" = 'SEASON' THEN 2
          WHEN sp."contentType" = 'RODEO' THEN 3
          WHEN sp."contentType" = 'ATHLETE' THEN 4
          WHEN sp."contentType" = 'LOCATION' THEN 5
          WHEN sp."contentType" = 'GALLERY' THEN 6
          WHEN sp."contentType" = 'ANNOUNCEMENT' THEN 7
          ELSE 99
        END,
        CASE
          WHEN sp."level" = 'PREMIER' THEN 1
          WHEN sp."level" = 'FEATURED' THEN 2
          WHEN sp."level" = 'STANDARD' THEN 3
          WHEN sp."level" = 'SUPPORTER' THEN 4
          ELSE 99
        END,
        s.name;
    `;

    return res.json(sponsorships || []);
  } catch (error) {
    console.error("GET_PUBLIC_SPONSORS_ERROR", error);
    return res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

export default router;