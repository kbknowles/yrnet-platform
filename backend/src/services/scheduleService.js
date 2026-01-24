import prisma from "../db/prisma.js";

/**
 * Get all published events for the active season
 */
export async function getSchedule() {
  return prisma.event.findMany({
    where: {
      status: "published",
      season: {
        active: true,
      },
    },
    orderBy: {
      startDate: "asc",
    },
    include: {
      location: true,
      scheduleItems: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });
}

/**
 * Get single event by slug
 */
export async function getEventBySlug(slug) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      location: true,
      scheduleItems: {
        orderBy: {
          date: "asc",
        },
      },
      callInPolicy: true,
      contacts: true,
    },
  });
}
