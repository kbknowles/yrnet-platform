// backend/routes/admin/sponsorships.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/admin/sponsorships
 */
router.get("/", async (req, res) => {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      include: { sponsor: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(sponsorships);
  } catch (err) {
    console.error("GET sponsorships failed", err);
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

/**
 * GET /api/admin/sponsorships/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id: Number(req.params.id) },
      include: { sponsor: true },
    });

    if (!sponsorship) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(sponsorship);
  } catch (err) {
    console.error("GET sponsorship failed", err);
    res.status(500).json({ error: "Failed to fetch sponsorship" });
  }
});

/**
 * POST /api/admin/sponsorships
 */
router.post("/", async (req, res) => {
  try {
    const {
      sponsorId,
      level,
      startDate,
      endDate,
      contentType,
      contentId,
      priority,
      active,
    } = req.body;

    const sponsorship = await prisma.sponsorship.create({
      data: {
        sponsorId: Number(sponsorId),
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        contentType: contentType || null,
        contentId: contentId ? Number(contentId) : null,
        priority: priority ?? 0,
        active: active ?? true,
      },
    });

    res.json(sponsorship);
  } catch (err) {
    console.error("POST sponsorship failed", err);
    res.status(500).json({ error: "Failed to create sponsorship" });
  }
});

/**
 * PUT /api/admin/sponsorships/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const {
      level,
      startDate,
      endDate,
      contentType,
      contentId,
      priority,
      active,
    } = req.body;

    const sponsorship = await prisma.sponsorship.update({
      where: { id: Number(req.params.id) },
      data: {
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        contentType: contentType || null,
        contentId: contentId ? Number(contentId) : null,
        priority: priority ?? 0,
        active: active ?? true,
      },
    });

    res.json(sponsorship);
  } catch (err) {
    console.error("PUT sponsorship failed", err);
    res.status(500).json({ error: "Failed to update sponsorship" });
  }
});

/**
 * DELETE /api/admin/sponsorships/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.sponsorship.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE sponsorship failed", err);
    res.status(500).json({ error: "Failed to delete sponsorship" });
  }
});

export default router;
