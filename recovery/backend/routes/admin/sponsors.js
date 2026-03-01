import express from "express";
import prisma from "../../prismaClient.mjs";
import multer from "multer";
import fs from "fs";

const router = express.Router();

/* =============================
   FILE STORAGE (RENDER DISK)
   Mounted at: /uploads
============================= */

const uploadDir = "/uploads/sponsors";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;

  const absolutePath = fileUrl.replace("/uploads", "/uploads");

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

/* =============================
   GET ALL
============================= */

router.get("/", async (req, res) => {
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
        website: req.body.website,
        description: req.body.description,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        internalNotes: req.body.internalNotes,
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
        website: req.body.website,
        description: req.body.description,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        internalNotes: req.body.internalNotes,
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
   UPLOAD LOGO (REPLACE / REFRESH)
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
   UPLOAD BANNER (REPLACE / REFRESH)
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
