// filepath: backend/routes/admin/gallery.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { upload } from "../../lib/upload.js";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router();

/* -------------------------- */
/* CREATE ALBUM (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/gallery */
/* -------------------------- */
router.post("/", resolveTenant, async (req, res) => {
  try {
    const { title, seasonId } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        tenantId: req.tenantId,
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
/* UPDATE ALBUM (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/gallery/:id */
/* -------------------------- */
router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const albumId = Number(req.params.id);
    const { title, seasonId } = req.body;

    const existing = await prisma.galleryAlbum.findFirst({
      where: { id: albumId, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Album not found" });
    }

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
/* DELETE ALBUM + IMAGES (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/gallery/:id */
/* -------------------------- */
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const albumId = Number(req.params.id);

    const existing = await prisma.galleryAlbum.findFirst({
      where: { id: albumId, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Album not found" });
    }

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
/* LIST ALBUMS + IMAGES (Tenant Scoped) */
/* GET /api/:tenantSlug/admin/gallery */
/* -------------------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: { tenantId: req.tenantId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(albums || []);
  } catch (err) {
    console.error("LIST ALBUMS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

/* -------------------------- */
/* UPLOAD IMAGE TO ALBUM (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/gallery/:id/images */
/* -------------------------- */
router.post(
  "/:id/images",
  resolveTenant,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const albumId = Number(req.params.id);

      const existing = await prisma.galleryAlbum.findFirst({
        where: { id: albumId, tenantId: req.tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: "Album not found" });
      }

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
  }
);

/* -------------------------- */
/* UPDATE IMAGE SORT ORDER (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/gallery/images/:id/order */
/* -------------------------- */
router.put(
  "/images/:id/order",
  resolveTenant,
  async (req, res) => {
    try {
      const imageId = Number(req.params.id);

      const image = await prisma.galleryImage.findFirst({
        where: {
          id: imageId,
          album: { tenantId: req.tenantId },
        },
      });

      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      const updated = await prisma.galleryImage.update({
        where: { id: imageId },
        data: { sortOrder: Number(req.body.sortOrder) },
      });

      res.json(updated);
    } catch (err) {
      console.error("UPDATE IMAGE ORDER ERROR:", err);
      res.status(500).json({ error: "Failed to update image order" });
    }
  }
);

/* -------------------------- */
/* DELETE IMAGE (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/gallery/images/:id */
/* -------------------------- */
router.delete(
  "/images/:id",
  resolveTenant,
  async (req, res) => {
    try {
      const imageId = Number(req.params.id);

      const image = await prisma.galleryImage.findFirst({
        where: {
          id: imageId,
          album: { tenantId: req.tenantId },
        },
      });

      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      await prisma.galleryImage.delete({
        where: { id: imageId },
      });

      res.json({ success: true });
    } catch (err) {
      console.error("DELETE IMAGE ERROR:", err);
      res.status(500).json({ error: "Failed to delete image" });
    }
  }
);

export default router;