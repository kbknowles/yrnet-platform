import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* GET featured albums (homepage) */
router.get("/", async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    where: { featured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      season: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(albums);
});

/* GET albums by season */
router.get("/season/:seasonId", async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    where: { seasonId: Number(req.params.seasonId) },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  res.json(albums);
});

/* GET single album with images */
router.get("/albums/:id", async (req, res) => {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      season: true,
    },
  });

  if (!album) {
    return res.status(404).json({ error: "Album not found" });
  }

  res.json(album);
});


export default router;
