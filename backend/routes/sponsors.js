import express from "express";
import prisma from "../prismaClient.mjs";
import upload from "../middleware/uploadSponsor.mjs";

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
        logoUrl: "", // required by schema, set empty until upload
        bannerUrl: null,
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
 * UPLOAD LOGO
 * ===============================
 */
router.post("/:id/upload-logo", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id: parseInt(id) },
      data: { logoUrl: fileUrl }
    });

    res.json(sponsor);
  } catch (error) {
    console.error("UPLOAD LOGO ERROR:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * ===============================
 * UPLOAD BANNER
 * ===============================
 */
router.post("/:id/upload-banner", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id: parseInt(id) },
      data: { bannerUrl: fileUrl }
    });

    res.json(sponsor);
  } catch (error) {
    console.error("UPLOAD BANNER ERROR:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * ===============================
 * ATTACH SPONSOR TO ATHLETE
 * MAX 4 ENFORCEMENT
 * ===============================
 */
router.post("/:id/attach-athlete/:athleteId", async (req, res) => {
  try {
    const { id, athleteId } = req.params;

    const count = await prisma.athleteSponsor.count({
      where: { athleteId: parseInt(athleteId) }
    });

    if (count >= 4) {
      return res.status(400).json({ error: "Athlete already has 4 sponsors" });
    }

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
