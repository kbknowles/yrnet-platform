// filepath: backend/routes/admin/athletes.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import uploadImage from "../../middleware/uploadImage.js";
import fs from "fs";

const router = express.Router();

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

function deleteFileIfExists(path) {
  if (!path) return;
  const fullPath = path.startsWith("/uploads")
    ? path
    : null;

  if (!fullPath) return;

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("FILE DELETE ERROR:", err);
  }
}

/* ----------------------------
   GET ALL
----------------------------- */
router.get("/", async (_req, res) => {
  try {
    const athletes = await prisma.athlete.findMany({
      orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
      include: { season: true },
    });

    res.json(athletes);
  } catch (err) {
    console.error("GET ATHLETES ERROR:", err);
    res.status(500).json({ error: "Failed to load athletes" });
  }
});

/* ----------------------------
   GET ONE
----------------------------- */
router.get("/:slug", async (req, res) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { slug: req.params.slug },
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
   CREATE
----------------------------- */
router.post(
  "/",
  uploadImage.fields([
    { name: "headshot", maxCount: 1 },
    { name: "actionPhotos", maxCount: 4 },
    { name: "videos", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const activeSeason = await prisma.season.findFirst({
        where: { active: true },
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
        ? `/uploads/images/${req.files.headshot[0].filename}`
        : null;

      const actionPhotos =
        req.files?.actionPhotos?.map(
          (f) => `/uploads/images/${f.filename}`
        ) || [];

      const videos =
        req.files?.videos?.map(
          (f) => `/uploads/videos/${f.filename}`
        ) || [];

      const athlete = await prisma.athlete.create({
        data: {
          ...req.body,
          slug,
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
   UPDATE
----------------------------- */
router.put(
  "/:slug",
  uploadImage.fields([
    { name: "headshot", maxCount: 1 },
    { name: "actionPhotos", maxCount: 4 },
    { name: "videos", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const { slug } = req.params;

      const existing = await prisma.athlete.findUnique({
        where: { slug },
      });

      if (!existing) {
        return res.status(404).json({ error: "Athlete not found" });
      }

      const updateData = {};

      /* Scalars */
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

      /* JSON */
      const parsedEvents = safeParseJSON(req.body.events);
      if (parsedEvents !== undefined) updateData.events = parsedEvents;

      const parsedSocial = safeParseJSON(req.body.socialLinks);
      if (parsedSocial !== undefined) updateData.socialLinks = parsedSocial;

      const parsedAwards = safeParseJSON(req.body.awards);
      if (parsedAwards !== undefined) updateData.awards = parsedAwards;

      /* Boolean */
      if (req.body.isActive !== undefined) {
        updateData.isActive =
          req.body.isActive === true || req.body.isActive === "true";
      }

      if (req.body.isFeatured !== undefined) {
        updateData.isFeatured =
          req.body.isFeatured === true || req.body.isFeatured === "true";
      }

      /* Headshot */
      if (req.body.headshotUrl === "") {
        deleteFileIfExists(existing.headshotUrl);
        updateData.headshotUrl = null;
      }

      if (req.files?.headshot?.[0]) {
        deleteFileIfExists(existing.headshotUrl);
        updateData.headshotUrl =
          `/uploads/images/${req.files.headshot[0].filename}`;
      }

      /* Action Photos */
      const incomingPhotos = safeParseJSON(req.body.actionPhotos);
      if (incomingPhotos !== undefined) {
        existing.actionPhotos?.forEach((path) => {
          if (!incomingPhotos.includes(path)) {
            deleteFileIfExists(path);
          }
        });

        updateData.actionPhotos = incomingPhotos;
      }

      if (req.files?.actionPhotos?.length) {
        updateData.actionPhotos = [
          ...(updateData.actionPhotos || existing.actionPhotos || []),
          ...req.files.actionPhotos.map(
            (f) => `/uploads/images/${f.filename}`
          ),
        ];
      }

      /* Videos */
      const incomingVideos = safeParseJSON(req.body.videos);
      if (incomingVideos !== undefined) {
        existing.videos?.forEach((path) => {
          if (!incomingVideos.includes(path)) {
            deleteFileIfExists(path);
          }
        });

        updateData.videos = incomingVideos;
      }

      if (req.files?.videos?.length) {
        updateData.videos = [
          ...(updateData.videos || existing.videos || []),
          ...req.files.videos.map(
            (f) => `/uploads/videos/${f.filename}`
          ),
        ];
      }

      const updated = await prisma.athlete.update({
        where: { slug },
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
   DELETE
----------------------------- */
router.delete("/:slug", async (req, res) => {
  try {
    const existing = await prisma.athlete.findUnique({
      where: { slug: req.params.slug },
    });

    if (existing) {
      deleteFileIfExists(existing.headshotUrl);
      existing.actionPhotos?.forEach(deleteFileIfExists);
      existing.videos?.forEach(deleteFileIfExists);
    }

    await prisma.athlete.delete({
      where: { slug: req.params.slug },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete athlete" });
  }
});

export default router;