import express from "express";
import prisma from "../../prismaClient.mjs";

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

    const {
      firstName,
      lastName,
      slug: _ignoreSlug,
      seasonId: _ignoreSeasonId,
      ...rest
    } = req.body || {};

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
router.put("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // 🔒 Strip all non-updatable fields
    const {
      id,
      slug: _ignoreSlug,
      seasonId,
      season,
      createdAt,
      updatedAt,
      ...safeData
    } = req.body || {};

    const athlete = await prisma.athlete.update({
      where: { slug },
      data: safeData,
    });

    res.json(athlete);
  } catch (err) {
    console.error("UPDATE ATHLETE ERROR:", err);
    res.status(500).json({ error: "Failed to update athlete" });
  }
});

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
