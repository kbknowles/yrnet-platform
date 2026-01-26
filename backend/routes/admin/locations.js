// filepath: backend/routes/admin/locations.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ---------------- */
/* GET ALL LOCATIONS */
/* ---------------- */
router.get("/", async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });

    res.json(locations);
  } catch (err) {
    console.error("GET /locations failed", err);
    res.status(500).json({ error: "Failed to load locations" });
  }
});

/* ---------------- */
/* CREATE LOCATION  */
/* ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      streetAddress,
      city,
      state,
      zip,
      venueInfo,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const location = await prisma.location.create({
      data: {
        name,
        streetAddress,
        city,
        state,
        zip,
        venueInfo: venueInfo || {},
      },
    });

    res.json(location);
  } catch (err) {
    console.error("POST /locations failed", err);
    res.status(500).json({ error: "Failed to create location" });
  }
});

export default router;
