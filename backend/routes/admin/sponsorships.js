// backend/routes/admin/sponsorships.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * ==============================
 * GET ALL SPONSORSHIPS (ADMIN)
 * ==============================
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
 * ==============================
 * GET SINGLE SPONSORSHIP
 * ==============================
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id },
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
 * ==============================
 * CREATE SPONSORSHIP
 * ==============================
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

    if (!sponsorId || !level || !startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

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
 * ==============================
 * UPDATE SPONSORSHIP
 * ==============================
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

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

    const sponsorship = await prisma.sponsorship.update({
      where: { id },
      data: {
        sponsorId: sponsorId ? Number(sponsorId) : undefined,
        level,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
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
 * ==============================
 * DELETE SPONSORSHIP
 * ==============================
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.sponsorship.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE sponsorship failed", err);
    res.status(500).json({ error: "Failed to delete sponsorship" });
  }
});

export default router;
