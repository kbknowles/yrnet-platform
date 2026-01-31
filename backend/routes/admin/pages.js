// filepath: backend/routes/admin/pages.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ------------------------------ */
/* GET ALL PAGES */
/* ------------------------------ */
router.get("/", async (req, res) => {
  const pages = await prisma.customPage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  res.json(pages);
});

/* ------------------------------ */
/* CREATE PAGE */
/* ------------------------------ */
router.post("/", async (req, res) => {
  const page = await prisma.customPage.create({
    data: req.body,
  });

  res.json(page);
});

/* ------------------------------ */
/* UPDATE PAGE */
/* ------------------------------ */
router.put("/:id", async (req, res) => {
  const page = await prisma.customPage.update({
    where: { id: Number(req.params.id) },
    data: req.body,
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
