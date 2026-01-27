import express from "express";

/* Admin routes */
import seasonsRouter from "./admin/seasons.js";
import locationsRouter from "./admin/locations.js";
import eventsAdminRouter from "./admin/events.js";
import announcementsAdminRouter from "./admin/announcements.js";
import officersRouter from "./admin/officers.js";
import sponsorsAdminRouter from "./admin/sponsors.js";
import adminGalleryRoutes from "./admin/gallery.js";

/* Public routes */
import eventsPublicRouter from "./events.js";
import announcementsPublicRouter from "./announcements.js";
import sponsorsPublicRouter from "./sponsors.js";
import seasonsPublicRouter from "./seasons.js";
import galleryPublicRouter from "./gallery.js";

const router = express.Router();

/* ---------------- ADMIN ---------------- */
router.use("/admin/seasons", seasonsRouter);
router.use("/admin/locations", locationsRouter);
router.use("/admin/events", eventsAdminRouter);
router.use("/admin/announcements", announcementsAdminRouter);
router.use("/admin/officers", officersRouter);
router.use("/admin/sponsors", sponsorsAdminRouter);
router.use("/admin/gallery", adminGalleryRoutes);

/* ---------------- PUBLIC ---------------- */
router.use("/events", eventsPublicRouter);
router.use("/announcements", announcementsPublicRouter);
router.use("/sponsors", sponsorsPublicRouter);
router.use("/seasons", seasonsPublicRouter);
router.use("/gallery", galleryPublicRouter);

export default router;
