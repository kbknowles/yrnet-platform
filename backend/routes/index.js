// filepath: backend/routes/index.js

import express from "express";

/* =========================
   ADMIN ROUTES
   ========================= */

import adminGate from "../middleware/adminGate.mjs";

import adminSeasonsRouter from "./admin/seasons.js";
import adminLocationsRouter from "./admin/locations.js";
import adminRodeosRouter from "./admin/rodeos.js";
import adminRodeoScheduleRouter from "./admin/rodeoSchedule.js";
import adminRodeoContactsRouter from "./admin/rodeoContacts.js";
import adminAnnouncementsRouter from "./admin/announcements.js";
import adminAnnouncementUploadRouter from "./admin/announcementUploads.js";
import adminOfficersRouter from "./admin/officers.js";
import adminSponsorsRouter from "./admin/sponsors.js";
import adminSponsorshipsRouter from "./admin/sponsorships.js";
import adminGalleryRouter from "./admin/gallery.js";
import adminPagesRouter from "./admin/pages.js";
import adminAthletesRouter from "./admin/athletes.js";
import adminSettingsRouter from "./admin/settings.js";
import adminDocumentsRouter from "./admin/documents.js";
import adminRoutes from "./admin/index.js";

/* =========================
   PUBLIC ROUTES
   ========================= */

import rodeosRouter from "./rodeos.js";
import scheduleRouter from "./schedule.js";
import announcementsRouter from "./announcements.js";
import sponsorsRouter from "./sponsors.js";
import seasonsRouter from "./seasons.js";
import galleryRouter from "./gallery.js";
import homeRouter from "./home.js";
import officersRouter from "./officers.js";
import pagesRouter from "./pages.js";
import athletesRouter from "./athletes.js";
import calendarRouter from "./calendar.js";
import sponsorshipsRouter from "./sponsorships.js";
import documentsRouter from "./documents.js";
import tenantResolver from "./tenantResolver.js";

const router = express.Router();

/* =========================
   MULTI-TENANT ROOT
   ========================= */

router.use("/resolve-tenant", tenantResolver);

/*
   All tenant routes now live under:
   /:tenantSlug/...
*/

/* -------------------------
   ADMIN LOGIN (NO GATE)
------------------------- */

router.use("/:tenantSlug/admin", adminRoutes);

/* -------------------------
   ADMIN PROTECTED ROUTES
------------------------- */

router.use("/:tenantSlug/admin/seasons", adminGate, adminSeasonsRouter);
router.use("/:tenantSlug/admin/locations", adminGate, adminLocationsRouter);
router.use("/:tenantSlug/admin/rodeos", adminGate, adminRodeosRouter);
router.use("/:tenantSlug/admin/rodeo-schedule-items", adminGate, adminRodeoScheduleRouter);
router.use("/:tenantSlug/admin/rodeo-contacts", adminGate, adminRodeoContactsRouter);
router.use("/:tenantSlug/admin/announcements", adminGate, adminAnnouncementsRouter);
router.use("/:tenantSlug/admin/announcements/upload", adminGate, adminAnnouncementUploadRouter);
router.use("/:tenantSlug/admin/officers", adminGate, adminOfficersRouter);
router.use("/:tenantSlug/admin/sponsors", adminGate, adminSponsorsRouter);
router.use("/:tenantSlug/admin/sponsorships", adminGate, adminSponsorshipsRouter);
router.use("/:tenantSlug/admin/gallery", adminGate, adminGalleryRouter);
router.use("/:tenantSlug/admin/pages", adminGate, adminPagesRouter);
router.use("/:tenantSlug/admin/athletes", adminGate, adminAthletesRouter);
router.use("/:tenantSlug/admin/settings", adminGate, adminSettingsRouter);
router.use("/:tenantSlug/admin/documents", adminGate, adminDocumentsRouter);

/* ---------- Public ---------- */

router.use("/:tenantSlug/rodeos", rodeosRouter);
router.use("/:tenantSlug/schedule", scheduleRouter);
router.use("/:tenantSlug/announcements", announcementsRouter);
router.use("/:tenantSlug/sponsors", sponsorsRouter);
router.use("/:tenantSlug/seasons", seasonsRouter);
router.use("/:tenantSlug/gallery", galleryRouter);
router.use("/:tenantSlug/home", homeRouter);
router.use("/:tenantSlug/officers", officersRouter);
router.use("/:tenantSlug/pages", pagesRouter);
router.use("/:tenantSlug/athletes", athletesRouter);
router.use("/:tenantSlug/calendar", calendarRouter);
router.use("/:tenantSlug/sponsorships", sponsorshipsRouter);
router.use("/:tenantSlug/documents", documentsRouter);

export default router;