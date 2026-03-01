// filepath: backend/routes/calendar.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

const router = express.Router();

/**
 * GET /api/calendar/:slug.ics
 * Public ICS download (tenant scoped)
 */
router.get("/:slug.ics", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).send("Tenant not found");
    }

    const slug = req.params.slug.toLowerCase();

    const event = await prisma.event.findFirst({
      where: {
        slug,
        tenantId: tenant.id,
        status: "published",
      },
      include: { location: true },
    });

    if (!event) {
      return res.status(404).send("Event not found");
    }

    const start =
      event.startDate
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const end =
      event.endDate
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const locationString = [
      event.location?.name,
      event.location?.city,
      event.location?.state,
    ]
      .filter(Boolean)
      .join(", ");

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YRNet//Association Calendar//EN
BEGIN:VEVENT
UID:${event.id}-${tenant.id}@yrnet
DTSTAMP:${start}
SUMMARY:${event.name}
DTSTART:${start}
DTEND:${end}
LOCATION:${locationString}
END:VEVENT
END:VCALENDAR
`.trim();

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.slug}.ics"`
    );

    res.send(ics);
  } catch (error) {
    console.error("ICS_EXPORT_ERROR:", error);
    res.status(500).send("Failed to generate calendar file");
  }
});

export default router;
