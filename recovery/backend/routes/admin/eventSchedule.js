// filepath: backend/routes/eventSchedule.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

const router = express.Router();

/* ---------------- */
/* GET PUBLIC EVENT SCHEDULE BY EVENT SLUG */
/* ---------------- */
router.get("/:slug", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const slug = req.params.slug.toLowerCase();

    const event = await prisma.event.findFirst({
      where: {
        slug,
        tenantId: tenant.id,
        status: "published",
      },
      include: {
        scheduleItems: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      eventId: event.id,
      eventName: event.name,
      scheduleItems: event.scheduleItems,
    });
  } catch (error) {
    console.error("PUBLIC EVENT SCHEDULE ERROR:", error);
    res.status(500).json({ error: "Failed to load event schedule" });
  }
});

export default router;
