//backend/routes/admin/officers.js

import express from "express";
import prisma from "../../prismaClient.mjs";


const router = express.Router();

/**
 * GET all officers
 */
router.get("/", async (req, res) => {
  try {
    const officers = await prisma.officer.findMany({
      include: { season: true },
      orderBy: { name: "asc" },
    });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE officer
 */
router.post("/", async (req, res) => {
  try {
    const officer = await prisma.officer.create({
      data: {
        name: req.body.name,
        role: req.body.role,
        type: req.body.type,
        emailAlias: req.body.emailAlias || null,
        phone: req.body.phone || null,
        seasonId: parseInt(req.body.seasonId),
        active: req.body.active ?? true,
      },
    });
    res.json(officer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * UPDATE officer
 */
router.put("/:id", async (req, res) => {
  try {
    const officer = await prisma.officer.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        role: req.body.role,
        type: req.body.type,
        emailAlias: req.body.emailAlias || null,
        phone: req.body.phone || null,
        seasonId: parseInt(req.body.seasonId),
        active: req.body.active,
      },
    });
    res.json(officer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE officer
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.officer.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
