// filepath: backend/routes/admin/sponsors.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router({ mergeParams: true });

/* =============================
   FILE STORAGE (RENDER DISK SAFE)
   Uses UPLOAD_ROOT if provided
============================= */

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.resolve("uploads");
const uploadDir = path.join(UPLOAD_ROOT, "sponsors");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});

const upload = multer({ storage });

function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;

  // fileUrl example: /uploads/sponsors/abc.png
  const absolutePath = path.join(
    UPLOAD_ROOT,
    fileUrl.replace("/uploads/", "")
  );

  try {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("FILE DELETE ERROR:", err);
  }
}

/* =============================
   GET ALL
============================= */

router.get("/", async (_req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(sponsors);
  } catch (err) {
    console.error("GET sponsors failed", err);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

/* =============================
   GET ONE
============================= */

router.get("/:id", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
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
   CREATE
============================= */

router.post("/", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.create({
      data: {
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
   UPDATE
============================= */

router.put("/:id", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.update({
      where: { id: Number(req.params.id) },
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
   DELETE SPONSOR
============================= */

router.delete("/:id", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
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
   UPLOAD LOGO
============================= */

router.post("/:id/upload-logo", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    deleteFileIfExists(sponsor.logoUrl);

    const filePath = `/uploads/sponsors/${req.file.filename}`;

    const updated = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl: filePath },
    });

    res.json(updated);
  } catch (err) {
    console.error("Upload logo failed", err);
    res.status(500).json({ error: "Failed to upload logo" });
  }
});

/* =============================
   DELETE LOGO
============================= */

router.delete("/:id/logo", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
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
   UPLOAD BANNER
============================= */

router.post("/:id/upload-banner", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!sponsor) {
      return res.status(404).json({ error: "Not found" });
    }

    deleteFileIfExists(sponsor.bannerUrl);

    const filePath = `/uploads/sponsors/${req.file.filename}`;

    const updated = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { bannerUrl: filePath },
    });

    res.json(updated);
  } catch (err) {
    console.error("Upload banner failed", err);
    res.status(500).json({ error: "Failed to upload banner" });
  }
});

/* =============================
   DELETE BANNER
============================= */

router.delete("/:id/banner", async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: Number(req.params.id) },
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