import express from "express";
import prisma from "../prismaClient.mjs";
import upload from "../middleware/uploadSponsor.js";

const router = express.Router();

/**
 * ===============================
 * GET ALL SPONSORS (ADMIN)
 * Sponsor = vendor contact info only
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
      include: { sponsorships: true },
    });

    res.json(sponsors);
  } catch (error) {
    console.error("GET SPONSORS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/**
 * ===============================
 * GET SPONSOR BY ID
 * ===============================
 */
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: { sponsorships: true },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor not found" });
    }

    res.json(sponsor);
  } catch (error) {
    console.error("GET SPONSOR ERROR:", error);
    res.status(500).json({ error: "Failed to fetch sponsor" });
  }
});

/**
 * ===============================
 * CREATE SPONSOR
 * (NO dates, NO tiers, NO active flag)
 * ===============================
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      internalNotes,
    } = req.body;

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        logoUrl: "",
        bannerUrl: null,
        website: website || null,
        description: description || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        internalNotes: internalNotes || null,
      },
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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    const {
      name,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      internalNotes,
    } = req.body;

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        name,
        website: website || null,
        description: description || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        internalNotes: internalNotes || null,
      },
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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    await prisma.sponsor.delete({
      where: { id },
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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: { logoUrl: fileUrl },
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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: { bannerUrl: fileUrl },
    });

    res.json(sponsor);
  } catch (error) {
    console.error("UPLOAD BANNER ERROR:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
