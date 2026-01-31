import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/* ------------------------------ */
/* GET ALL PUBLISHED PAGES */
/* ------------------------------ */
router.get("/", async (req, res) => {
  const pages = await prisma.customPage.findMany({
    where: { status: "published" },
    orderBy: { sortOrder: "asc" },
    select: {
      title: true,
      slug: true,
      showInMenu: true,
      showInFooter: true,
    },
  });

  res.json(pages);
});

/* ------------------------------ */
/* GET PAGE BY SLUG */
/* ------------------------------ */
router.get("/:slug", async (req, res) => {
  const page = await prisma.customPage.findFirst({
    where: {
      slug: req.params.slug,
      status: "published",
    },
  });

  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }

  res.json(page);
});

export default router;
