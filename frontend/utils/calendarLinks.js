export function buildCalendarLinks(event) {
  const start = new Date(event.startDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(event.endDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = encodeURIComponent(event.name);
  const details = encodeURIComponent(event.generalInfo || "");
  const location = encodeURIComponent(
    `${event.location?.name || ""}, ${event.location?.city || ""}, ${event.location?.state || ""}`
  );

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`,
    ics: `/calendar/${event.slug}.ics`
  };
}
