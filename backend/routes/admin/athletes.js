// filepath: backend/routes/admin/athletes.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import uploadImage from "../../middleware/uploadImage.js";

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
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    return undefined;
  }
}

/* ----------------------------
   GET ALL (ADMIN)
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
   GET ONE BY SLUG (ADMIN)
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
   CREATE (ADMIN)
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
        return res
          .status(400)
          .json({ error: "First and last name are required" });
      }

      const slug = slugify(firstName, lastName);

      const actionPhotos =
        req.files?.actionPhotos?.map(
          (f) => `/uploads/images/${f.filename}`
        ) || [];

      const videos =
        req.files?.videos?.map(
          (f) => `/uploads/videos/${f.filename}`
        ) || [];

      const headshotUrl = req.files?.headshot?.[0]
        ? `/uploads/images/${req.files.headshot[0].filename}`
        : null;

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
      console.error("CREATE ATHLETE ERROR:", err);

      if (err.code === "P2002") {
        return res
          .status(409)
          .json({ error: "Athlete with this name already exists" });
      }

      res.status(500).json({ error: "Failed to create athlete" });
    }
  }
);

/* ----------------------------
   UPDATE BY SLUG (ADMIN)
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

      /* ---- JSON fields ---- */
      const parsedSocialLinks = safeParseJSON(req.body.socialLinks);
      if (parsedSocialLinks !== undefined) {
        updateData.socialLinks = parsedSocialLinks;
      }

      const parsedAwards = safeParseJSON(req.body.awards);
      if (parsedAwards !== undefined) {
        updateData.awards = parsedAwards;
      }

      const parsedEvents = safeParseJSON(req.body.events);
      if (parsedEvents !== undefined) {
        updateData.events = parsedEvents;
      }

      /* ---- Boolean ---- */
      if (req.body.isActive !== undefined) {
        updateData.isActive =
          req.body.isActive === true || req.body.isActive === "true";
      }

      if (req.body.isFeatured !== undefined) {
        updateData.isFeatured =
          req.body.isFeatured === true || req.body.isFeatured === "true";
      }

      /* ---- Integer ---- */
      if (req.body.sortOrder !== undefined && req.body.sortOrder !== "") {
        const parsedSort = parseInt(req.body.sortOrder, 10);
        if (!isNaN(parsedSort)) {
          updateData.sortOrder = parsedSort;
        }
      }

      /* ---- Scalars ---- */
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

      /* ---- Media Handling ---- */

      if (req.files?.headshot?.[0]) {
        updateData.headshotUrl =
          `/uploads/images/${req.files.headshot[0].filename}`;
      }

      if (req.files?.actionPhotos?.length) {
        updateData.actionPhotos = [
          ...(existing.actionPhotos || []),
          ...req.files.actionPhotos.map(
            (f) => `/uploads/images/${f.filename}`
          ),
        ];
      }

      if (req.files?.videos?.length) {
        updateData.videos = [
          ...(existing.videos || []),
          ...req.files.videos.map(
            (f) => `/uploads/videos/${f.filename}`
          ),
        ];
      }

      const updatedAthlete = await prisma.athlete.update({
        where: { slug },
        data: updateData,
      });

      res.json(updatedAthlete);
    } catch (err) {
      console.error("UPDATE ATHLETE ERROR:", err);
      res.status(500).json({ error: "Failed to update athlete" });
    }
  }
);

/* ----------------------------
   DELETE
----------------------------- */
router.delete("/:slug", async (req, res) => {
  try {
    await prisma.athlete.delete({
      where: { slug: req.params.slug },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE ATHLETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete athlete" });
  }
});

export default router;