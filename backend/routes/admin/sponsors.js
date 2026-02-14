import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/**
 * GET /api/admin/sponsors
 */
router.get("/", async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      include: {
        athletes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(sponsors);
  } catch (err) {
    console.error("GET /admin/sponsors failed", err);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/**
 * GET /api/admin/sponsors/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: {
        athletes: true,
      },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor not found" });
    }

    res.json(sponsor);
  } catch (err) {
    console.error("GET /admin/sponsors/:id failed", err);
    res.status(500).json({ error: "Failed to fetch sponsor" });
  }
});

/**
 * POST /api/admin/sponsors
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      logoUrl,
      bannerUrl,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      startDate,
      endDate,
      tier,
      active,
      internalNotes,
    } = req.body;

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        logoUrl: logoUrl || "",
        bannerUrl: bannerUrl || null,
        website: website || "",
        description: description || "",
        contactName: contactName || "",
        contactEmail: contactEmail || "",
        contactPhone: contactPhone || "",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tier,
        active: active ?? true,
        internalNotes: internalNotes || "",
      },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("POST /admin/sponsors failed", err);
    res.status(500).json({ error: "Failed to create sponsor" });
  }
});

/**
 * PUT /api/admin/sponsors/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    const {
      name,
      logoUrl,
      bannerUrl,
      website,
      description,
      contactName,
      contactEmail,
      contactPhone,
      startDate,
      endDate,
      tier,
      active,
      internalNotes,
    } = req.body;

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        name,
        logoUrl: logoUrl || "",
        bannerUrl: bannerUrl || null,
        website: website || "",
        description: description || "",
        contactName: contactName || "",
        contactEmail: contactEmail || "",
        contactPhone: contactPhone || "",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tier,
        active: active ?? true,
        internalNotes: internalNotes || "",
      },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("PUT /admin/sponsors failed", err);
    res.status(500).json({ error: "Failed to update sponsor" });
  }
});

/**
 * DELETE /api/admin/sponsors/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid sponsor ID" });
    }

    await prisma.sponsor.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /admin/sponsors failed", err);
    res.status(500).json({ error: "Failed to delete sponsor" });
  }
});

export default router;
