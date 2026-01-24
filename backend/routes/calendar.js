import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

router.get("/:slug.ics", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { slug: req.params.slug },
    include: { location: true },
  });

  if (!event) return res.status(404).end();

  const start = new Date(event.startDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(event.endDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  res.setHeader("Content-Type", "text/calendar");
  res.send(
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART:${start}
DTEND:${end}
LOCATION:${event.location?.name || ""}
END:VEVENT
END:VCALENDAR`
  );
});

export default router;
