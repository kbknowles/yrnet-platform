import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

/**
 * GET /api/gallery/albums
 * List albums (public)
 */
router.get("/", async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      season: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(albums);
});

/**
 * GET /api/gallery/albums/:id
 * Single album (public)
 */
router.get("/:id", async (req, res) => {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      season: true,
    },
  });

  if (!album) {
    return res.status(404).json({ error: "Album not found" });
  }

  res.json(album);
});

export default router;
