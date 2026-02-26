// filepath: backend/routes/admin/pages.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ------------------------------ */
/* GET ALL PAGES */
/* ------------------------------ */
router.get("/", async (req, res) => {
  const pages = await prisma.customPage.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  res.json(pages);
});

/* ------------------------------ */
/* CREATE PAGE */
/* ------------------------------ */
router.post("/", async (req, res) => {
  const {
    title,
    slug,
    content,
    status,
    showInMenu,
    showInFooter,
    sortOrder,
    isPlaceholder,
    layoutType,
    sections,
    heroImage,
    heroSubtitle,
  } = req.body;

  const page = await prisma.customPage.create({
    data: {
      title,
      slug,
      content,
      status,
      showInMenu: Boolean(showInMenu),
      showInFooter: Boolean(showInFooter),
      sortOrder: Number(sortOrder) || 0,
      isPlaceholder: Boolean(isPlaceholder),
      layoutType: layoutType || "standard",
      sections,
      heroImage,
      heroSubtitle,
    },
  });

  res.json(page);
});

/* ------------------------------ */
/* UPDATE PAGE */
/* ------------------------------ */
router.put("/:id", async (req, res) => {
  const {
    title,
    slug,
    content,
    status,
    showInMenu,
    showInFooter,
    sortOrder,
    isPlaceholder,
    layoutType,
    sections,
    heroImage,
    heroSubtitle,
  } = req.body;

  const page = await prisma.customPage.update({
    where: { id: Number(req.params.id) },
    data: {
      title,
      slug,
      content,
      status,
      showInMenu: Boolean(showInMenu),
      showInFooter: Boolean(showInFooter),
      sortOrder: Number(sortOrder) || 0,
      isPlaceholder: Boolean(isPlaceholder),
      layoutType,
      sections,
      heroImage,
      heroSubtitle,
    },
  });

  res.json(page);
});

/* ------------------------------ */
/* DELETE PAGE */
/* ------------------------------ */
router.delete("/:id", async (req, res) => {
  await prisma.customPage.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ success: true });
});

export default router;