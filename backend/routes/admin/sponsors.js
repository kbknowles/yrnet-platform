// backend/routes/admin/sponsors.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/admin/sponsors
 */
router.get("/", async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(sponsors);
  } catch (err) {
    console.error("GET /sponsors failed", err);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/**
 * POST /api/admin/sponsors
 */
router.post("/", async (req, res) => {
  try {
    const { name, logoUrl, website, active } = req.body;

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        logoUrl,
        website,
        active: active ?? true,
      },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("POST /sponsors failed", err);
    res.status(500).json({ error: "Failed to create sponsor" });
  }
});

/**
 * DELETE /api/admin/sponsors/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.sponsor.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /sponsors failed", err);
    res.status(500).json({ error: "Failed to delete sponsor" });
  }
});

export default router;
