// filepath: backend/routes/documents.js

import express from "express";
import prisma from "../prismaClient.mjs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/*
  PUBLIC DOCUMENT ROUTES
  -------------------------------------------------------
  - Read-only access
  - No create/update/delete allowed
*/

/*
  GET /:tenantSlug/documents
  -------------------------------------------------------
  Returns public documents only

  Query Params:
  - category (optional): GOVERNANCE | MEMBERSHIP | PROGRAMS

  Notes:
  - Filters by tenant
  - Only returns isPublic = true
  - Sorted by sortOrder ASC
*/
router.get("/", resolveTenant, async (req, res) => {
  try {
    const { category } = req.query;

    /*
      OPTIONAL CATEGORY FILTER VALIDATION
    */
    const allowedCategories = ["GOVERNANCE", "MEMBERSHIP", "PROGRAMS"];

    let categoryFilter = undefined;

    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }
      categoryFilter = category;
    }

    /*
      FETCH DOCUMENTS
    */
    const docs = await prisma.document.findMany({
      where: {
        tenantId: req.tenantId,
        isPublic: true,
        ...(categoryFilter ? { category: categoryFilter } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load documents" });
  }
});

export default router;