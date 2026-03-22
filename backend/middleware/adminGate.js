// filepath: backend/middleware/adminGate.js

/*** 
  Admin Gate Middleware
  ---------------------------------------
  - Requires Authorization header: Bearer <ADMIN_SECRET>
  - Protects all admin routes
  - Includes tenant validation hook (future-ready)
*/

export default function adminGate(req, res, next) {
  try {
    const auth = req.headers.authorization;

    /* -------------------------
       AUTH HEADER REQUIRED
    ------------------------- */
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = auth.split(" ")[1];

    /* -------------------------
       TOKEN VALIDATION
    ------------------------- */
    if (!token || token !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }

    /* -------------------------
       OPTIONAL: TENANT CHECK (future-safe)
       Assumes req.tenant is set upstream
    ------------------------- */
    if (req.tenant && req.headers["x-tenant-slug"]) {
      const headerSlug = req.headers["x-tenant-slug"];

      if (req.tenant.slug !== headerSlug) {
        return res.status(403).json({ error: "Tenant mismatch" });
      }
    }

    /* -------------------------
       PASS THROUGH
    ------------------------- */
    next();
  } catch (err) {
    console.error("adminGate error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}