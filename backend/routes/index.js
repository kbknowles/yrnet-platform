import express from "express";

/* =========================
   ADMIN ROUTES
   ========================= */

import adminSeasonsRouter from "./admin/seasons.js";
import adminLocationsRouter from "./admin/locations.js";
import adminEventsRouter from "./admin/events.js";
import adminEventScheduleItemsRouter from "./admin/eventScheduleItems.js";
import adminEventContactsRouter from "./admin/eventContacts.js";
import adminAnnouncementsRouter from "./admin/announcements.js";
import adminAnnouncementUploadRouter from "./admin/announcementUpload.js";
import adminOfficersRouter from "./admin/officers.js";
import adminSponsorsRouter from "./admin/sponsors.js";
import adminSponsorshipsRouter from "./admin/sponsorships.js";
import adminGalleryRouter from "./admin/gallery.js";
import adminPagesRouter from "./admin/pages.js";
import adminUploadsRouter from "./admin/uploads.js";
import adminAthletesRouter from "./admin/athletes.js";

/* =========================
   PUBLIC ROUTES
   ========================= */

import eventsRouter from "./events.js";
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

const router = express.Router();

/* ---------- Admin ---------- */
router.use("/admin/seasons", adminSeasonsRouter);
router.use("/admin/locations", adminLocationsRouter);
router.use("/admin/events", adminEventsRouter);
router.use("/admin/event-schedule-items", adminEventScheduleItemsRouter);
router.use("/admin/event-contacts", adminEventContactsRouter);
router.use("/admin/announcements", adminAnnouncementsRouter);
router.use("/admin/announcements/upload", adminAnnouncementUploadRouter);
router.use("/admin/officers", adminOfficersRouter);
router.use("/admin/sponsors", adminSponsorsRouter);
router.use("/admin/sponsorships", adminSponsorshipsRouter);
router.use("/admin/gallery", adminGalleryRouter);
router.use("/admin/pages", adminPagesRouter);
router.use("/admin/uploads", adminUploadsRouter);
router.use("/admin/athletes", adminAthletesRouter);

/* ---------- Public ---------- */
router.use("/events", eventsRouter);
router.use("/schedule", scheduleRouter);
router.use("/announcements", announcementsRouter);
router.use("/sponsors", sponsorsRouter);
router.use("/seasons", seasonsRouter);
router.use("/gallery", galleryRouter);
router.use("/home", homeRouter);
router.use("/officers", officersRouter);
router.use("/pages", pagesRouter);
router.use("/athletes", athletesRouter);
router.use("/calendar", calendarRouter);
router.use("/sponsorships", sponsorshipsRouter);

export default router;
