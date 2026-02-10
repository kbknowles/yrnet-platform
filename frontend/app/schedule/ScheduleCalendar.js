// frontend/app/schedule/ScheduleCalendar.js
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleCalendar({ events, onSelect }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={(info) => onSelect(info.event.extendedProps.slug)}
      height="auto"
    />
  );
}
