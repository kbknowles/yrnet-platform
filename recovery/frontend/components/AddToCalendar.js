import { buildCalendarLinks } from "../utils/calendarLinks";

export default function AddToCalendar({ event }) {
  const links = buildCalendarLinks(event);

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={links.google}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Add to Google Calendar
      </a>

      <a
        href={links.ics}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Download .ics
      </a>
    </div>
  );
}
