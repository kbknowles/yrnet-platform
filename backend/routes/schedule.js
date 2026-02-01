// filepath: backend/routes/pages.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* ---------------------------------
   PUBLIC PAGE BY SLUG
---------------------------------- */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  const page = await prisma.page.findFirst({
    where: {
      slug,
      published: true,
    },
  });

  if (!page) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(page);
});

export default router;
