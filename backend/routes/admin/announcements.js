import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* GET all announcements */
router.get("/", async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(announcements);
});

/* CREATE */
router.post("/", async (req, res) => {
  const announcement = await prisma.announcement.create({
    data: req.body,
  });
  res.json(announcement);
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  const announcement = await prisma.announcement.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(announcement);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await prisma.announcement.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

export default router;
