import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* GET all gallery albums (public) */
router.get("/", async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1, // cover image
      },
      season: true,
    },
  });

  res.json(albums);
});

/* GET single album with images */
router.get("/albums/:id", async (req, res) => {
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
