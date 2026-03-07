// filepath: backend/middleware/resolveTenant.js

import prisma from "../prismaClient.mjs";

export async function resolveTenant(req, res, next) {
  try {
    const { tenantSlug } = req.params;

    if (!tenantSlug) {
      return res.status(400).json({ error: "Tenant slug missing" });
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        slug: tenantSlug,
        active: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;
    req.tenantId = tenant.id;

    next();
  } catch (err) {
    console.error("TENANT RESOLUTION ERROR:", err);
    res.status(500).json({ error: "Failed to resolve tenant" });
  }
}