import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

router.get("/:eventId", async (req, res) => {
  const items = await prisma.eventScheduleItem.findMany({
    where: { eventId: Number(req.params.eventId) },
    orderBy: { startTime: "asc" },
  });
  res.json(items);
});

router.post("/", async (req, res) => {
  const item = await prisma.eventScheduleItem.create({
    data: {
      eventId: Number(req.body.eventId),
      title: req.body.title,
      startTime: new Date(req.body.startTime),
      endTime: req.body.endTime ? new Date(req.body.endTime) : null,
      notes: req.body.notes || null,
    },
  });
  res.json(item);
});

export default router;
