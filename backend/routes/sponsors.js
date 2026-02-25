// filepath: backend/routes/sponsors.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * ===============================
 * GET PUBLIC SPONSORS
 * Ordered by:
 * 1. contentType priority
 * 2. level priority
 * 3. sponsor name (alphabetical)
 * ===============================
 */
router.get("/", async (_req, res) => {
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
      WHERE sp.active = true
      ORDER BY
        CASE 
          WHEN sp."contentType" IS NULL THEN 1
          WHEN sp."contentType" = 'SEASON' THEN 2
          WHEN sp."contentType" = 'EVENT' THEN 3
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

    res.json(sponsorships);
  } catch (error) {
    console.error("GET PUBLIC SPONSORS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

export default router;