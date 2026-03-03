import prisma from "../prismaClient.mjs";

export async function resolveTenant(req, res, next) {
  try {
    const { tenantSlug } = req.params;

    if (!tenantSlug) {
      return res.status(400).json({ error: "Tenant slug required" });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant || !tenant.active) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;        // full tenant object
    req.tenantId = tenant.id;   // convenience shortcut

    next();
  } catch (err) {
    console.error("Tenant resolution error:", err);
    res.status(500).json({ error: "Tenant resolution failed" });
  }
}