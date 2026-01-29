// filepath: backend/routes/admin/gallery.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { upload } from "../../lib/upload.js";

const router = express.Router();

/* -------------------------- */
/* CREATE ALBUM               */
/* -------------------------- */
router.post("/", async (req, res) => {
  try {
    const { title, seasonId } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        seasonId: seasonId ? Number(seasonId) : null,
      },
    });

    res.json(album);
  } catch (err) {
    console.error("CREATE ALBUM ERROR:", err);
    res.status(500).json({ error: "Failed to create album" });
  }
});

/* -------------------------- */
/* UPDATE ALBUM               */
/* -------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const albumId = Number(req.params.id);
    const { title, seasonId } = req.body;

    const album = await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: {
        title,
        seasonId: seasonId ? Number(seasonId) : null,
      },
    });

    res.json(album);
  } catch (err) {
    console.error("UPDATE ALBUM ERROR:", err);
    res.status(500).json({ error: "Failed to update album" });
  }
});

/* -------------------------- */
/* DELETE ALBUM + IMAGES      */
/* -------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const albumId = Number(req.params.id);

    await prisma.galleryImage.deleteMany({
      where: { albumId },
    });

    await prisma.galleryAlbum.delete({
      where: { id: albumId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ALBUM ERROR:", err);
    res.status(500).json({ error: "Failed to delete album" });
  }
});

/* -------------------------- */
/* LIST ALBUMS + IMAGES       */
/* -------------------------- */
router.get("/", async (req, res) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(albums);
  } catch (err) {
    console.error("LIST ALBUMS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

/* -------------------------- */
/* UPLOAD IMAGE TO ALBUM      */
/* -------------------------- */
router.post("/:id/images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const albumId = Number(req.params.id);

    const image = await prisma.galleryImage.create({
      data: {
        albumId,
        imageUrl: `/uploads/gallery/${req.file.filename}`,
        caption: req.body.caption || null,
        sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
      },
    });

    res.json(image);
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/* -------------------------- */
/* UPDATE IMAGE SORT ORDER    */
/* -------------------------- */
router.put("/images/:id/order", async (req, res) => {
  try {
    const image = await prisma.galleryImage.update({
      where: { id: Number(req.params.id) },
      data: { sortOrder: Number(req.body.sortOrder) },
    });

    res.json(image);
  } catch (err) {
    console.error("UPDATE IMAGE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to update image order" });
  }
});

/* -------------------------- */
/* DELETE IMAGE               */
/* -------------------------- */
router.delete("/images/:id", async (req, res) => {
  try {
    await prisma.galleryImage.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE IMAGE ERROR:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
