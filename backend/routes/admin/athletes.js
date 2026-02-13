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
router.post("/", async (req, res) => {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { active: true },
    });

    if (!activeSeason) {
      return res.status(400).json({ error: "No active season found" });
    }

    const { firstName, lastName, ...rest } = req.body || {};

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "First and last name are required" });
    }

    const slug = slugify(firstName, lastName);

    const athlete = await prisma.athlete.create({
      data: {
        firstName,
        lastName,
        slug,
        seasonId: activeSeason.id,
        ...rest,
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
});

/* ----------------------------
   UPDATE BY SLUG (ADMIN)
----------------------------- */
router.put(
  "/:slug",
  uploadImage.fields([
    { name: "headshot", maxCount: 1 },
    { name: "actionPhoto", maxCount: 1 },
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

      // ---- JSON fields ----
      if (req.body.socialLinks) {
        updateData.socialLinks = JSON.parse(req.body.socialLinks);
      }

      if (req.body.awards) {
        updateData.awards = JSON.parse(req.body.awards);
      }

      // ---- Enum array ----
      if (req.body.events) {
        updateData.events = JSON.parse(req.body.events);
      }

      // ---- Boolean fields ----
      if (req.body.isActive !== undefined) {
        updateData.isActive = req.body.isActive === "true";
      }

      if (req.body.isFeatured !== undefined) {
        updateData.isFeatured = req.body.isFeatured === "true";
      }

      // ---- Integer ----
      if (req.body.sortOrder !== undefined) {
        updateData.sortOrder = parseInt(req.body.sortOrder, 10);
      }

      // ---- Scalar fields ----
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

      // ---- Image overwrites ----
      if (req.files?.headshot?.[0]) {
        updateData.headshotUrl =
          `/uploads/images/${req.files.headshot[0].filename}`;
      }

      if (req.files?.actionPhoto?.[0]) {
        updateData.actionPhotoUrl =
          `/uploads/images/${req.files.actionPhoto[0].filename}`;
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
   DELETE BY SLUG (ADMIN)
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
