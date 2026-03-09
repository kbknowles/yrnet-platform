// filepath: backend/routes/admin/athletes.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import uploadImage from "../../middleware/uploadImage.js";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import fs from "fs";
import path from "path";

const router = express.Router({ mergeParams: true });

/* ----------------------------
   UTILS
----------------------------- */

function slugify(firstName, lastName) {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeParseJSON(value) {
  if (!value) return undefined;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function deleteFileIfExists(filePath) {
  if (!filePath) return;

  const absolutePath = path.join("/", filePath);

  try {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("FILE DELETE ERROR:", err);
  }
}

function tenantUploadPath(tenantSlug, type, filename) {
  return `/uploads/tenants/${tenantSlug}/${type}/${filename}`;
}

/* ----------------------------
   GET ALL (Tenant Scoped)
GET /:tenantSlug/admin/athletes
----------------------------- */

router.get("/", resolveTenant, async (req, res) => {
  try {
    const athletes = await prisma.athlete.findMany({
      where: { tenantId: req.tenantId },
      orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
      include: { season: true },
    });

    res.json(athletes || []);
  } catch (err) {
    console.error("GET ATHLETES ERROR:", err);
    res.status(500).json({ error: "Failed to load athletes" });
  }
});

/* ----------------------------
   GET ONE (Tenant Scoped)
GET /:tenantSlug/admin/athletes/:slug
----------------------------- */

router.get("/:slug", resolveTenant, async (req, res) => {
  try {
    const athlete = await prisma.athlete.findFirst({
      where: {
        slug: req.params.slug,
        tenantId: req.tenantId,
      },
      include: { season: true },
    });

    if (!athlete) {
      return res.status(404).json({ error: "Athlete not found" });
    }

    res.json(athlete);
  } catch (err) {
    console.error("GET ATHLETE ERROR:", err);
    res.status(500).json({ error: "Failed to load athlete" });
  }
});

/* ----------------------------
   CREATE (Tenant Scoped)
POST /:tenantSlug/admin/athletes
----------------------------- */

router.post(
  "/",
  resolveTenant,
  uploadImage.fields([
    { name: "headshot", maxCount: 1 },
    { name: "actionPhotos", maxCount: 4 },
    { name: "videos", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const activeSeason = await prisma.season.findFirst({
        where: { tenantId: req.tenantId, active: true },
      });

      if (!activeSeason) {
        return res.status(400).json({ error: "No active season found" });
      }

      const { firstName, lastName } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).json({ error: "Name required" });
      }

      const slug = slugify(firstName, lastName);

      const headshotUrl = req.files?.headshot?.[0]
        ? tenantUploadPath(
            req.tenant.slug,
            "images",
            req.files.headshot[0].filename
          )
        : null;

      const actionPhotos =
        req.files?.actionPhotos?.map((f) =>
          tenantUploadPath(req.tenant.slug, "images", f.filename)
        ) || [];

      const videos =
        req.files?.videos?.map((f) =>
          tenantUploadPath(req.tenant.slug, "videos", f.filename)
        ) || [];

      const athlete = await prisma.athlete.create({
        data: {
          ...req.body,
          slug,
          tenantId: req.tenantId,
          seasonId: activeSeason.id,
          headshotUrl,
          actionPhotos,
          videos,
          events: safeParseJSON(req.body.events) || [],
          socialLinks: safeParseJSON(req.body.socialLinks) || [],
          awards: safeParseJSON(req.body.awards) || [],
        },
      });

      res.json(athlete);
    } catch (err) {
      console.error("CREATE ERROR:", err);
      res.status(500).json({ error: "Failed to create athlete" });
    }
  }
);

/* ----------------------------
   UPDATE (Tenant Scoped)
PUT /:tenantSlug/admin/athletes/:slug
----------------------------- */

router.put(
  "/:slug",
  resolveTenant,
  uploadImage.fields([
    { name: "headshot", maxCount: 1 },
    { name: "actionPhotos", maxCount: 4 },
    { name: "videos", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const { slug } = req.params;

      const existing = await prisma.athlete.findFirst({
        where: { slug, tenantId: req.tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: "Athlete not found" });
      }

      const updateData = {};

      [
        "firstName",
        "lastName",
        "school",
        "grade",
        "hometown",
        "bio",
        "futureGoals",
        "standings",
      ].forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const parsedEvents = safeParseJSON(req.body.events);
      if (parsedEvents !== undefined) updateData.events = parsedEvents;

      const parsedSocial = safeParseJSON(req.body.socialLinks);
      if (parsedSocial !== undefined) updateData.socialLinks = parsedSocial;

      const parsedAwards = safeParseJSON(req.body.awards);
      if (parsedAwards !== undefined) updateData.awards = parsedAwards;

      if (req.body.isActive !== undefined) {
        updateData.isActive =
          req.body.isActive === true || req.body.isActive === "true";
      }

      if (req.body.isFeatured !== undefined) {
        updateData.isFeatured =
          req.body.isFeatured === true || req.body.isFeatured === "true";
      }

      if (req.body.headshotUrl === "") {
        deleteFileIfExists(existing.headshotUrl);
        updateData.headshotUrl = null;
      }

      if (req.files?.headshot?.[0]) {
        deleteFileIfExists(existing.headshotUrl);

        updateData.headshotUrl = tenantUploadPath(
          req.tenant.slug,
          "images",
          req.files.headshot[0].filename
        );
      }

      const incomingPhotos = safeParseJSON(req.body.actionPhotos);

      if (incomingPhotos !== undefined) {
        existing.actionPhotos?.forEach((p) => {
          if (!incomingPhotos.includes(p)) {
            deleteFileIfExists(p);
          }
        });

        updateData.actionPhotos = incomingPhotos;
      }

      if (req.files?.actionPhotos?.length) {
        const newPhotos = req.files.actionPhotos.map((f) =>
          tenantUploadPath(req.tenant.slug, "images", f.filename)
        );

        updateData.actionPhotos = [
          ...(updateData.actionPhotos ?? existing.actionPhotos ?? []),
          ...newPhotos,
        ];
      }

      const incomingVideos = safeParseJSON(req.body.videos);

      if (incomingVideos !== undefined) {
        existing.videos?.forEach((p) => {
          if (!incomingVideos.includes(p)) {
            deleteFileIfExists(p);
          }
        });

        updateData.videos = incomingVideos;
      }

      if (req.files?.videos?.length) {
        const newVideos = req.files.videos.map((f) =>
          tenantUploadPath(req.tenant.slug, "videos", f.filename)
        );

        updateData.videos = [
          ...(updateData.videos ?? existing.videos ?? []),
          ...newVideos,
        ];
      }

      const updated = await prisma.athlete.update({
        where: { id: existing.id },
        data: updateData,
      });

      res.json(updated);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ error: "Failed to update athlete" });
    }
  }
);

/* ----------------------------
   DELETE (Tenant Scoped)
DELETE /:tenantSlug/admin/athletes/:slug
----------------------------- */

router.delete("/:slug", resolveTenant, async (req, res) => {
  try {
    const existing = await prisma.athlete.findFirst({
      where: { slug: req.params.slug, tenantId: req.tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Athlete not found" });
    }

    deleteFileIfExists(existing.headshotUrl);
    existing.actionPhotos?.forEach(deleteFileIfExists);
    existing.videos?.forEach(deleteFileIfExists);

    await prisma.athlete.delete({
      where: { id: existing.id },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete athlete" });
  }
});

export default router;