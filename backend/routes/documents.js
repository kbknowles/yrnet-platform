// filepath: backend/routes/documents.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/*
  GET /:tenantSlug/documents
  Public documents list
*/
router.get("/", resolveTenant, async (req, res) => {
  try {
    const { category } = req.query;

    const docs = await prisma.document.findMany({
      where: {
        tenantId: req.tenantId,
        isPublic: true,
        ...(category ? { category } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load documents" });
  }
});

/*
  POST /:tenantSlug/documents
  Create document (admin)
*/
router.post("/", resolveTenant, async (req, res) => {
  try {
    const { title, description, category, fileUrl } = req.body;

    const doc = await prisma.document.create({
      data: {
        tenantId: req.tenantId,
        title,
        description,
        category,
        fileUrl,
      },
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to create document" });
  }
});

/*
  DELETE /:tenantSlug/documents/:id
*/
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    await prisma.document.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;