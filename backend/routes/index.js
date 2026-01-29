// filepath: backend/routes/index.js

import express from "express";

/* =========================
   ADMIN ROUTES
   ========================= */

import seasonsRouter from "./admin/seasons.js";
import locationsRouter from "./admin/locations.js";
import eventsAdminRouter from "./admin/events.js";
import eventScheduleItemsRouter from "./admin/eventScheduleItems.js";
import eventContactsRouter from "./admin/eventContacts.js";
import announcementsAdminRouter from "./admin/announcements.js";
import officersRouter from "./admin/officers.js";
import sponsorsRouter from "./admin/sponsors.js";
import adminGalleryRoutes from "./admin/gallery.js";

/* =========================
   PUBLIC ROUTES
   ========================= */

import eventsPublicRouter from "./events.js";
import announcementsPublicRouter from "./announcements.js";
import sponsorsRoutes from "./sponsors.js";
import seasonsRoutes from "./seasons.js";
import galleryRoutes from "./gallery.js";
import homeRoutes from "./home.js";

const router = express.Router();

/* ---------- Admin ---------- */
router.use("/admin/seasons", seasonsRouter);
router.use("/admin/locations", locationsRouter);
router.use("/admin/events", eventsAdminRouter);
router.use("/admin/event-schedule-items", eventScheduleItemsRouter);
router.use("/admin/event-contacts", eventContactsRouter);
router.use("/admin/announcements", announcementsAdminRouter);
router.use("/admin/officers", officersRouter);
router.use("/admin/sponsors", sponsorsRouter);
router.use("/admin/gallery", adminGalleryRoutes);

/* ---------- Public ---------- */
router.use("/events", eventsPublicRouter);
router.use("/announcements", announcementsPublicRouter);
router.use("/sponsors", sponsorsRoutes);
router.use("/seasons", seasonsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/home", homeRoutes);

export default router;
