// filepath: backend/routes/gallery.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* ----------------------- */
/* UTIL: SLUG NORMALIZER   */
/* ----------------------- */
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* -------------------------------- */
/* GET ALL PUBLISHED ALBUMS (PUBLIC) */
/* -------------------------------- */
router.get("/", async (req, res) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        season: true,
      },
    });

    const withSlugs = albums.map((a) => ({
      ...a,
      slug: toSlug(a.title),
    }));

    res.json(withSlugs);
  } catch (err) {
    console.error("PUBLIC GALLERY LIST ERROR:", err);
    res.status(500).json({ error: "Failed to fetch gallery albums" });
  }
});

/* -------------------------------- */
/* GET SINGLE ALBUM BY SLUG (PUBLIC) */
/* -------------------------------- */
router.get("/albums/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const albums = await prisma.galleryAlbum.findMany({
      where: { published: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        season: true,
      },
    });

    const album = albums.find(
      (a) => toSlug(a.title) === slug
    );

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({
      ...album,
      slug,
    });
  } catch (err) {
    console.error("PUBLIC GALLERY ALBUM ERROR:", err);
    res.status(500).json({ error: "Failed to fetch album" });
  }
});

export default router;
