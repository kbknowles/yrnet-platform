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
      return res.status(404).end();
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
      return res.status(404).end();
    }

    const start =
      new Date(event.startDate)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const end =
      new Date(event.endDate)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${slug}.ics"`
    );

    res.send(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YRNet//Association Calendar//EN
BEGIN:VEVENT
UID:${event.id}-${tenant.id}@yrnet
DTSTAMP:${start}
SUMMARY:${event.name}
DTSTART:${start}
DTEND:${end}
LOCATION:${event.location?.name || ""}
END:VEVENT
END:VCALENDAR`);
  } catch (error) {
    console.error("ICS_EXPORT_ERROR:", error);
    res.status(500).end();
  }
});

export default router;
