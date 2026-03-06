// filepath: backend/routes/calendar.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

function toIcsUtc(dt) {
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * GET /api/:tenantSlug/calendar/:slug.ics
 */
router.get("/:tenantSlug/:slug.ics", resolveTenant, async (req, res) => {
  try {
    const { slug } = req.params;

    const rodeo = await prisma.rodeo.findUnique({
      where: {
        slug_tenantId: {
          slug,
          tenantId: req.tenantId,
        },
      },
      include: { location: true },
    });

    if (!rodeo) return res.status(404).end();

    const start = toIcsUtc(rodeo.startDate);
    const end = toIcsUtc(rodeo.endDate);

    if (!start || !end) {
      return res.status(500).json({ error: "Invalid startDate/endDate for ICS" });
    }

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${slug}.ics"`
    );

    res.send(
      `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YRNet//Rodeo Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${escapeIcsText(slug)}@yrnet
SUMMARY:${escapeIcsText(rodeo.name)}
DTSTART:${start}
DTEND:${end}
LOCATION:${escapeIcsText(rodeo.location?.name || "")}
END:VEVENT
END:VCALENDAR`
    );
  } catch (err) {
    console.error("ICS_API_ERROR", err);
    return res.status(500).json({ error: "Failed to generate ICS" });
  }
});

export default router;