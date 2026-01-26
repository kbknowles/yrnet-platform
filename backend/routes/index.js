// backend/routes/index.js

import express from "express";

import seasonsRouter from "./admin/seasons.js";
import locationsRouter from "./admin/locations.js";
import eventsRouter from "./admin/events.js";

import eventScheduleRouter from "./admin/eventSchedule.js";



const router = express.Router();

// Admin routes
router.use("/admin/seasons", seasonsRouter);
router.use("/admin/locations", locationsRouter);
router.use("/admin/events", eventsRouter);


router.use("/admin/event-schedule", eventScheduleRouter);


export default router;

