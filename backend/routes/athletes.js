import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* ----------------------------
   GET ONE BY SLUG (PUBLIC)
   Canonical: slug-only
----------------------------- */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Invalid athlete slug" });
  }

  const athlete = await prisma.athlete.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });

  if (!athlete) {
    return res.status(404).json({ error: "Athlete not found" });
  }

  res.json(athlete);
});

export default router;
