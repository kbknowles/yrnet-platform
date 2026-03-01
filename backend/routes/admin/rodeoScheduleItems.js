// filepath: backend/routes/admin/eventScheduleItems.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ---------------------------- */
/* GET ITEMS FOR EVENT          */
/* ---------------------------- */
router.get("/event/:eventId", async (req, res) => {
  const eventId = Number(req.params.eventId);

  const items = await prisma.eventScheduleItem.findMany({
    where: { eventId },
    orderBy: { startTime: "asc" },
  });

  res.json(items);
});

/* ---------------------------- */
/* CREATE SCHEDULE ITEM         */
/* ---------------------------- */
router.post("/", async (req, res) => {
  const { eventId, title, startTime, endTime, description } = req.body;

  const item = await prisma.eventScheduleItem.create({
    data: {
      eventId: Number(eventId),
      title,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      description: description || null,
    },
  });

  res.json(item);
});

/* ---------------------------- */
/* UPDATE SCHEDULE ITEM         */
/* ---------------------------- */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, startTime, endTime, description } = req.body;

  const item = await prisma.eventScheduleItem.update({
    where: { id },
    data: {
      title,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      description: description || null,
    },
  });

  res.json(item);
});

/* ---------------------------- */
/* DELETE SCHEDULE ITEM         */
/* ---------------------------- */
router.delete("/:id", async (req, res) => {
  await prisma.eventScheduleItem.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ success: true });
});

export default router;
