// filepath: backend/routes/sponsors.js
import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/sponsors
 * Public – active sponsors only
 */
router.get("/", async (req, res) => {
  const sponsors = await prisma.sponsor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  res.json(sponsors);
});

export default router;
