// filepath: backend/routes/admin/announcements.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ============================
   GET ALL (Tenant Scoped)
GET /:tenantSlug/admin/announcements
============================ */
router.get("/", resolveTenant, async (req, res) => {
  try {
    const items = await prisma.announcement.findMany({
      where: {
        tenantId: req.tenantId,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        rodeo: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            endDate: true,
          },
        },
        season: {
          select: {
            id: true,
            year: true,
            active: true,
          },
        },
      },
    });

    return res.json(items || []);
  } catch (err) {
    console.error("ADMIN_ANNOUNCEMENTS_GET_ALL_ERROR", err);
    return res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

/* ============================
   CREATE
   POST /:tenantSlug/admin/announcements
============================ */
router.post("/", resolveTenant, async (req, res) => {
  try {
    const {
      rodeoId,
      seasonId,
      title,
      content,
      mode = "STANDARD",
      imageUrl,
      sortOrder = 0,
      extras,
      published = false,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        tenantId: req.tenantId,
        title,
        mode,
        content: mode === "POSTER" ? "" : content,
        imageUrl: imageUrl || null,
        sortOrder: Number(sortOrder) || 0,
        extras,
        published: Boolean(published),
        rodeoId: rodeoId ? Number(rodeoId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    return res.json(announcement);
  } catch (err) {
    console.error("ADMIN_ANNOUNCEMENTS_CREATE_ERROR", err);
    return res.status(400).json({ error: "Failed to create announcement" });
  }
});

/* ============================
   UPDATE
   PUT /:tenantSlug/admin/announcements/:id
============================ */
router.put("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.announcement.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const {
      title,
      content,
      mode,
      imageUrl,
      sortOrder,
      extras,
      published,
      rodeoId,
      seasonId,
      publishAt,
      expireAt,
    } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        mode,
        content: mode === "POSTER" ? "" : content,
        imageUrl,
        sortOrder,
        extras,
        published,
        rodeoId: rodeoId ? Number(rodeoId) : null,
        seasonId: seasonId ? Number(seasonId) : null,
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
    });

    return res.json(announcement);
  } catch (err) {
    console.error("ADMIN_ANNOUNCEMENTS_UPDATE_ERROR", err);
    return res.status(400).json({ error: "Failed to update announcement" });
  }
});

/* ============================
   DELETE
   DELETE /:tenantSlug/admin/announcements/:id
============================ */
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.announcement.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("ADMIN_ANNOUNCEMENTS_DELETE_ERROR", err);
    return res.status(400).json({ error: "Failed to delete announcement" });
  }
});

export default router;