import express from "express";
import prisma from "../../prismaClient.mjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* =============================
   FILE STORAGE
============================= */

const uploadDir = path.resolve("uploads/sponsors");

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
        logoUrl: "",
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
   DELETE
============================= */

router.delete("/:id", async (req, res) => {
  try {
    await prisma.sponsor.delete({
      where: { id: Number(req.params.id) },
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
    const filePath = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id: Number(req.params.id) },
      data: { logoUrl: filePath },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("Upload logo failed", err);
    res.status(500).json({ error: "Failed to upload logo" });
  }
});

/* =============================
   UPLOAD BANNER
============================= */

router.post("/:id/upload-banner", upload.single("file"), async (req, res) => {
  try {
    const filePath = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await prisma.sponsor.update({
      where: { id: Number(req.params.id) },
      data: { bannerUrl: filePath },
    });

    res.json(sponsor);
  } catch (err) {
    console.error("Upload banner failed", err);
    res.status(500).json({ error: "Failed to upload banner" });
  }
});

export default router;
