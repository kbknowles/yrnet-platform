// filepath: backend/middleware/resolveTenant.js

import prisma from "../prismaClient.mjs";



export async function resolveTenant(req, res, next) {
  try {
    console.log("RESOLVE_TENANT PARAMS:", req.originalUrl, req.params);
    console.log("PARAMS:", req.params);
    const tenantSlug = req.params?.tenantSlug;

    if (!tenantSlug) {
      return res.status(400).json({ error: "Tenant slug required" });
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        slug: tenantSlug,
        active: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        domain: true,
        primaryColor: true,
        accentColor: true,
        logoUrl: true,
        active: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenantId = tenant.id;
    req.tenant = tenant;

    next();
  } catch (err) {
    console.error("RESOLVE_TENANT_ERROR", err);
    return res.status(500).json({ error: "Tenant resolution failed" });
  }
}

