import express from "express";
import prisma from "../prismaClient.js";
import { upload } from "../../lib/upload.js";

const router = express.Router();

/* CREATE album */
router.post("/", async (req, res) => {
  const album = await prisma.galleryAlbum.create({
    data: req.body,
  });
  res.json(album);
});

/* LIST albums */
router.get("/", async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(albums);
});

/* UPLOAD image */
router.post("/:id/images", upload.single("image"), async (req, res) => {
  const image = await prisma.galleryImage.create({
    data: {
      albumId: Number(req.params.id),
      imageUrl: `/uploads/gallery/${req.file.filename}`,
      caption: req.body.caption || null,
      sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
    },
  });
  res.json(image);
});

/* UPDATE image order */
router.put("/images/:id/order", async (req, res) => {
  const image = await prisma.galleryImage.update({
    where: { id: Number(req.params.id) },
    data: { sortOrder: Number(req.body.sortOrder) },
  });
  res.json(image);
});

/* DELETE image */
router.delete("/images/:id", async (req, res) => {
  await prisma.galleryImage.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

export default router;
