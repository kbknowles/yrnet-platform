/*
  Warnings:

  - The values [SECOND_VICE_PRESIDENT] on the enum `OfficerRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[slug,tenantId]` on the table `Athlete` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,tenantId]` on the table `CustomPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,tenantId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year,tenantId]` on the table `Season` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Athlete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `CallInPolicy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `CustomPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `GalleryAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OfficerRole_new" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'SECOND_VICE_PESIDENT', 'SECRETARY', 'TREASURER', 'POINTS_SECRETARY', 'NATIONAL_DIRECTOR', 'STATE_DIRECTOR', 'REGION_DIRECTOR', 'BOARD_MEMBER', 'STUDENT_PRESIDENT', 'STUDENT_VICE_PRESIDENT', 'STUDENT_SECRETARY', 'QUEEN', 'JH_PRINCESS');
ALTER TABLE "Officer" ALTER COLUMN "role" TYPE "OfficerRole_new" USING ("role"::text::"OfficerRole_new");
ALTER TYPE "OfficerRole" RENAME TO "OfficerRole_old";
ALTER TYPE "OfficerRole_new" RENAME TO "OfficerRole";
DROP TYPE "public"."OfficerRole_old";
COMMIT;

-- DropIndex
DROP INDEX "Athlete_slug_key";

-- DropIndex
DROP INDEX "CustomPage_slug_key";

-- DropIndex
DROP INDEX "Event_slug_key";

-- DropIndex
DROP INDEX "Season_year_key";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CallInPolicy" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CustomPage" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GalleryAlbum" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Officer" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "primaryColor" TEXT,
    "accentColor" TEXT,
    "logoUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_slug_tenantId_key" ON "Athlete"("slug", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPage_slug_tenantId_key" ON "CustomPage"("slug", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_tenantId_key" ON "Event"("slug", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_tenantId_key" ON "Season"("year", "tenantId");

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallInPolicy" ADD CONSTRAINT "CallInPolicy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPage" ADD CONSTRAINT "CustomPage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
