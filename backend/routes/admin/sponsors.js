// filepath: backend/routes/admin/sponsors.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import upload from "../../middleware/uploadSponsorImage.js";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import fs from "fs";
import path from "path";

const router = express.Router({ mergeParams: true });

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || "/uploads";

/* =============================
   UTILS
============================= */

function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;

  try {
    const relative = fileUrl.replace("/uploads/", "");
    const absolutePath = path.join(UPLOAD_ROOT, relative);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("FILE DELETE ERROR:", err);
  }
}

/* =============================
   GET ALL (Tenant Scoped)
============================= */

router.get("/", resolveTenant, async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { createdAt: "desc" },
    });

    res.json(sponsors || []);
  } catch (err) {
    console.error("GET sponsors failed", err);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/* =============================
   GET ONE (Tenant Scoped)
============================= */

router.get("/:id", resolveTenant, async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findFirst({
      where: {
        id: Number(req.params.id),
        tenantId: req.tenantId,
      },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(sponsor);
  } catch (err) {
    console.error("GET sponsor failed", err);
    res.status(500).json({ error: "Failed to fetch sponsor" });
  }
});

/* =============================
   CREATE (Tenant Scoped)
============================= */

router.post("/", resolveTenant, async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.create({
      data: {
        tenantId: req.tenantId,
        name: req.body.name,
        website: req.body.website || null,
        description: req.body.description || null,
        contactName: req.body.contactName || null,
        contactEmail: req.body.contactEmail || null,
        contactPhone: req.body.contactPhone || null,
        internalNotes: req.body.internalNotes || null,
        logoUrl: null,
        bannerUrl: null,
      },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("CREATE sponsor failed", err);
    res.status(500).json({ error: "Failed to create sponsor" });
  }
});

/* =============================
   UPDATE (Tenant Scoped)
============================= */

router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const existing = await prisma.sponsor.findFirst({
      where: {
        id: Number(req.params.id),
        tenantId: req.tenantId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }

    const sponsor = await prisma.sponsor.update({
      where: { id: existing.id },
      data: {
        name: req.body.name,
        website: req.body.website || null,
        description: req.body.description || null,
        contactName: req.body.contactName || null,
        contactEmail: req.body.contactEmail || null,
        contactPhone: req.body.contactPhone || null,
        internalNotes: req.body.internalNotes || null,
      },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("UPDATE sponsor failed", err);
    res.status(500).json({ error: "Failed to update sponsor" });
  }
});

/* =============================
   DELETE SPONSOR (Tenant Scoped)
============================= */

router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findFirst({
      where: {
        id: Number(req.params.id),
        tenantId: req.tenantId,
      },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    deleteFileIfExists(sponsor.logoUrl);
    deleteFileIfExists(sponsor.bannerUrl);

    await prisma.sponsor.delete({
      where: { id: sponsor.id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE sponsor failed", err);
    res.status(500).json({ error: "Failed to delete sponsor" });
  }
});

/* =============================
   UPLOAD LOGO (Tenant Scoped)
============================= */

router.post(
  "/:id/upload-logo",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const sponsor = await prisma.sponsor.findFirst({
        where: {
          id: Number(req.params.id),
          tenantId: req.tenantId,
        },
      });

      if (!sponsor) {
        return res.status(404).json({ error: "Not found" });
      }

      deleteFileIfExists(sponsor.logoUrl);

      const tenantSlug = req.params.tenantSlug;
      const filePath = `/uploads/tenants/${tenantSlug}/sponsors/${req.file.filename}`;

      const updated = await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: { logoUrl: filePath },
      });

      res.json(updated);
    } catch (err) {
      console.error("Upload logo failed", err);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  }
);

/* =============================
   DELETE LOGO
============================= */

router.delete("/:id/logo", resolveTenant, async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findFirst({
      where: {
        id: Number(req.params.id),
        tenantId: req.tenantId,
      },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    deleteFileIfExists(sponsor.logoUrl);

    const updated = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl: null },
    });

    res.json(updated);
  } catch (err) {
    console.error("Delete logo failed", err);
    res.status(500).json({ error: "Failed to delete logo" });
  }
});

/* =============================
   UPLOAD BANNER (Tenant Scoped)
============================= */

router.post(
  "/:id/upload-banner",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const sponsor = await prisma.sponsor.findFirst({
        where: {
          id: Number(req.params.id),
          tenantId: req.tenantId,
        },
      });

      if (!sponsor) {
        return res.status(404).json({ error: "Not found" });
      }

      deleteFileIfExists(sponsor.bannerUrl);

      const tenantSlug = req.params.tenantSlug;
      const filePath = `/uploads/tenants/${tenantSlug}/sponsors/${req.file.filename}`;

      const updated = await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: { bannerUrl: filePath },
      });

      res.json(updated);
    } catch (err) {
      console.error("Upload banner failed", err);
      res.status(500).json({ error: "Failed to upload banner" });
    }
  }
);

/* =============================
   DELETE BANNER
============================= */

router.delete("/:id/banner", resolveTenant, async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findFirst({
      where: {
        id: Number(req.params.id),
        tenantId: req.tenantId,
      },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    deleteFileIfExists(sponsor.bannerUrl);

    const updated = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { bannerUrl: null },
    });

    res.json(updated);
  } catch (err) {
    console.error("Delete banner failed", err);
    res.status(500).json({ error: "Failed to delete banner" });
  }
});

export default router;