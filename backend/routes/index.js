// filepath: backend/routes/index.js

import express from "express";

/* =========================
   ADMIN ROUTES (MUST COME FIRST)
   ========================= */

import seasonsRouter from "./admin/seasons.js";
import locationsRouter from "./admin/locations.js";
import eventsAdminRouter from "./admin/events.js";
import eventScheduleItemsRouter from "./admin/eventScheduleItems.js";
import eventContactsRouter from "./admin/eventContacts.js";
import announcementsAdminRouter from "./admin/announcements.js";
import adminOfficersRouter from "./admin/officers.js";
import sponsorsRouter from "./admin/sponsors.js";
import adminGalleryRoutes from "./admin/gallery.js";
import adminPagesRoutes from "./admin/pages.js";
import uploadRoutes from "./admin/uploads.js";
import adminAthletesRouter from "./admin/athletes.js";

/* =========================
   PUBLIC ROUTES
   ========================= */

import eventsPublicRouter from "./events.js";
import schedulePublicRouter from "./schedule.js";
import announcementsPublicRouter from "./announcements.js";
import sponsorsRoutes from "./sponsors.js";
import seasonsRoutes from "./seasons.js";
import galleryRoutes from "./gallery.js";
import homeRoutes from "./home.js";
import officersPublicRouter from "./officers.js";
import pagesRoutes from "./pages.js";
import athletesPublicRouter from "./athletes.js";

const router = express.Router();

/* ---------- Admin ---------- */
router.use("/admin/seasons", seasonsRouter);
router.use("/admin/locations", locationsRouter);
router.use("/admin/events", eventsAdminRouter);
router.use("/admin/event-schedule-items", eventScheduleItemsRouter);
router.use("/admin/event-contacts", eventContactsRouter);
router.use("/admin/announcements", announcementsAdminRouter);
router.use("/admin/officers", adminOfficersRouter);
router.use("/admin/sponsors", sponsorsRouter);
router.use("/admin/gallery", adminGalleryRoutes);
router.use("/admin/pages", adminPagesRoutes);
router.use("/admin/uploads", uploadRoutes);
router.use("/admin/athletes", adminAthletesRouter);

/* ---------- Public ---------- */
router.use("/events", eventsPublicRouter);
router.use("/schedule", schedulePublicRouter);
router.use("/announcements", announcementsPublicRouter);
router.use("/sponsors", sponsorsRoutes);
router.use("/seasons", seasonsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/home", homeRoutes);
router.use("/officers", officersPublicRouter);
router.use("/pages", pagesRoutes);
router.use("/athletes", athletesPublicRouter);

export default router;
