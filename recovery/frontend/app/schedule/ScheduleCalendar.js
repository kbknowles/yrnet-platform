// frontend/app/schedule/ScheduleCalendar.js
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleCalendar({ events, onSelect }) {
  const calendarEvents = events.map((e) => ({
    id: e.slug,
    title: e.name,
    start: e.startDate,
    end: e.endDate || e.startDate,
    allDay: true,          // 🔒 force all-day styling
    extendedProps: {
      slug: e.slug,
    },
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"

      /* --- Layout control --- */
      fixedWeekCount={false}     // ✅ prevents forced 6-week months
      showNonCurrentDates={false}
      height={420}               // ✅ stable height similar to list
      aspectRatio={1.35}

      /* --- Events --- */
      events={calendarEvents}
      allDayDefault={true}

      /* --- Interaction --- */
      eventClick={(info) => {
        onSelect(info.event.extendedProps.slug);
      }}
    />
  );
}
