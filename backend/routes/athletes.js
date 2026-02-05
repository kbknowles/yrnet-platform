import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* ----------------------------
   GET ONE (PUBLIC)
----------------------------- */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid athlete id" });
  }

  const athlete = await prisma.athlete.findFirst({
    where: {
      id,
      isActive: true,
    },
  });

  if (!athlete) {
    return res.status(404).json({ error: "Athlete not found" });
  }

  res.json(athlete);
});

export default router;
