// filepath: backend/services/scheduleService.js

import prisma from "../prismaClient.mjs";
import { getCurrentTenant } from "../utils/getTenant.js";

/**
 * Get all published events for the active season (tenant scoped)
 */
export async function getSchedule() {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return prisma.event.findMany({
    where: {
      tenantId: tenant.id,
      status: "published",
      season: {
        active: true,
        tenantId: tenant.id,
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
 * Get single event by slug (tenant scoped)
 */
export async function getEventBySlug(slug) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return prisma.event.findFirst({
    where: {
      slug,
      tenantId: tenant.id,
      status: "published",
    },
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
