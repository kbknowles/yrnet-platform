import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.get("/:slug.ics", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { slug: req.params.slug },
    include: { location: true },
  });

  if (!event) {
    return res.status(404).send("Event not found");
  }

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART:${event.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${event.endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
LOCATION:${event.location.name}, ${event.location.city}, ${event.location.state}
END:VEVENT
END:VCALENDAR
`.trim();

  res.setHeader("Content-Type", "text/calendar");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${event.slug}.ics"`
  );
  res.send(ics);
});

export default router;
