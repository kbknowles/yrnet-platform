// filepath: backend/routes/gallery.mjs

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* -------------------------------- */
/* GET ALL PUBLISHED ALBUMS (PUBLIC) */
/* -------------------------------- */
router.get("/", async (req, res) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" }, // ALL images
        },
        season: true,
      },
    });

    res.json(albums);
  } catch (err) {
    console.error("PUBLIC GALLERY LIST ERROR:", err);
    res.status(500).json({ error: "Failed to fetch gallery albums" });
  }
});

/* -------------------------------- */
/* GET SINGLE ALBUM + IMAGES (PUBLIC)*/
/* -------------------------------- */
router.get("/albums/:id", async (req, res) => {
  try {
    const albumId = Number(req.params.id);

    const album = await prisma.galleryAlbum.findFirst({
      where: {
        id: albumId,
        published: true,
      },
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
  } catch (err) {
    console.error("PUBLIC GALLERY ALBUM ERROR:", err);
    res.status(500).json({ error: "Failed to fetch album" });
  }
});

export default router;
