import prisma from "../prismaClient.mjs";

export async function getCurrentTenant() {
  return prisma.tenant.findFirst({
    where: { slug: "ahsra" }
  });
}
