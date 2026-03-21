import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { host } = req.query;

    if (!host) {
      return res.status(400).json({ error: "Host required" });
    }

    host = host.toLowerCase().replace(/^www\./, "").split(":")[0];

    const tenant = await prisma.tenant.findFirst({
      where: { domain: host },
      select: {
        id: true,
        slug: true,
        name: true,
        domain: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    return res.json(tenant);
  } catch (err) {
    console.error("resolver error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;