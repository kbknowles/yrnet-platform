import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * ===============================
 * GET ALL SPONSORS (ADMIN)
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: [
        { tier: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        athletes: true
      }
    });

    res.json(sponsors);
  } catch (error) {
    console.error("GET SPONSORS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/**
 * ===============================
 * GET ACTIVE SPONSORS (PUBLIC)
 * ===============================
 */
router.get("/active", async (req, res) => {
  try {
    const now = new Date();

    const sponsors = await prisma.sponsor.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: { tier: "asc" }
    });

    res.json(sponsors);
  } catch (error) {
    console.error("GET ACTIVE SPONSORS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch active sponsors" });
  }
});

/**
 * ===============================
 * CREATE SPONSOR
 * ===============================
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      tier,
      logoUrl,
      bannerUrl,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      startDate,
      endDate,
      active,
      internalNotes
    } = req.body;

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        tier,
        logoUrl,
        bannerUrl,
        website,
        description,
        contactName,
        contactEmail,
        contactPhone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active,
        internalNotes
      }
    });

    res.json(sponsor);
  } catch (error) {
    console.error("CREATE SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to create sponsor" });
  }
});

/**
 * ===============================
 * UPDATE SPONSOR
 * ===============================
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      tier,
      logoUrl,
      bannerUrl,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      startDate,
      endDate,
      active,
      internalNotes
    } = req.body;

    const sponsor = await prisma.sponsor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        tier,
        logoUrl,
        bannerUrl,
        website,
        description,
        contactName,
        contactEmail,
        contactPhone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active,
        internalNotes
      }
    });

    res.json(sponsor);
  } catch (error) {
    console.error("UPDATE SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to update sponsor" });
  }
});

/**
 * ===============================
 * DELETE SPONSOR
 * ===============================
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sponsor.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to delete sponsor" });
  }
});

/**
 * ===============================
 * ATTACH SPONSOR TO ATHLETE
 * ===============================
 */
router.post("/:id/attach-athlete/:athleteId", async (req, res) => {
  try {
    const { id, athleteId } = req.params;

    const link = await prisma.athleteSponsor.create({
      data: {
        sponsorId: parseInt(id),
        athleteId: parseInt(athleteId)
      }
    });

    res.json(link);
  } catch (error) {
    console.error("ATTACH SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to attach sponsor to athlete" });
  }
});

/**
 * ===============================
 * REMOVE SPONSOR FROM ATHLETE
 * ===============================
 */
router.delete("/:id/remove-athlete/:athleteId", async (req, res) => {
  try {
    const { id, athleteId } = req.params;

    await prisma.athleteSponsor.delete({
      where: {
        athleteId_sponsorId: {
          sponsorId: parseInt(id),
          athleteId: parseInt(athleteId)
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("REMOVE SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to remove sponsor from athlete" });
  }
});

export default router;
