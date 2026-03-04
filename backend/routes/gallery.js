// filepath: backend/routes/gallery.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ----------------------- */
/* UTIL: SLUG NORMALIZER   */
/* ----------------------- */
function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* -------------------------------- */
/* GET ALL PUBLISHED ALBUMS (PUBLIC) */
/* GET /api/:tenantSlug/gallery      */
/* -------------------------------- */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: {
        tenantId: req.tenantId,
        published: true,
      },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        season: true,
      },
    });

    const withSlugs = (albums || []).map((a) => ({
      ...a,
      slug: toSlug(a.title),
    }));

    return res.json(withSlugs);
  } catch (err) {
    console.error("PUBLIC_GALLERY_LIST_ERROR", err);
    return res.status(200).json([]);
  }
});

/* -------------------------------- */
/* GET SINGLE ALBUM BY SLUG (PUBLIC) */
/* GET /api/:tenantSlug/gallery/albums/:slug */
/* -------------------------------- */
router.get("/albums/:slug", resolveTenant, async (req, res) => {
  try {
    const slug = String(req.params.slug || "");

    const albums = await prisma.galleryAlbum.findMany({
      where: {
        tenantId: req.tenantId,
        published: true,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        season: true,
      },
    });

    const album = (albums || []).find((a) => toSlug(a.title) === slug);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    return res.json({ ...album, slug });
  } catch (err) {
    console.error("PUBLIC_GALLERY_ALBUM_ERROR", err);
    return res.status(500).json({ error: "Failed to fetch album" });
  }
});

export default router;