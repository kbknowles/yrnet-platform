/*
  Warnings:

  - The values [EVENT] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [SECOND_VICE_PESIDENT] on the enum `OfficerRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `eventId` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `actionPhotoUrl` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventScheduleItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('ATHLETE', 'RODEO', 'LOCATION', 'GALLERY', 'ANNOUNCEMENT', 'SEASON');
ALTER TABLE "Sponsorship" ALTER COLUMN "contentType" TYPE "ContentType_new" USING ("contentType"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "public"."ContentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OfficerRole_new" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'SECOND_VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'POINTS_SECRETARY', 'NATIONAL_DIRECTOR', 'STATE_DIRECTOR', 'REGION_DIRECTOR', 'BOARD_MEMBER', 'STUDENT_PRESIDENT', 'STUDENT_VICE_PRESIDENT', 'STUDENT_SECRETARY', 'QUEEN', 'JH_PRINCESS');
ALTER TABLE "Officer" ALTER COLUMN "role" TYPE "OfficerRole_new" USING ("role"::text::"OfficerRole_new");
ALTER TYPE "OfficerRole" RENAME TO "OfficerRole_old";
ALTER TYPE "OfficerRole_new" RENAME TO "OfficerRole";
DROP TYPE "public"."OfficerRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_callInPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "EventContact" DROP CONSTRAINT "EventContact_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventScheduleItem" DROP CONSTRAINT "EventScheduleItem_eventId_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "eventId",
ADD COLUMN     "rodeoId" INTEGER;

-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "actionPhotoUrl",
ADD COLUMN     "actionPhotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "CustomPage" ADD COLUMN     "heroSubtitle" TEXT;

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventContact";

-- DropTable
DROP TABLE "EventScheduleItem";

-- CreateTable
CREATE TABLE "Rodeo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "callInPolicyId" INTEGER,
    "generalInfo" TEXT,
    "specials" JSONB,
    "isStateFinals" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rodeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RodeoScheduleItem" (
    "id" SERIAL NOT NULL,
    "rodeoId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RodeoScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RodeoContact" (
    "id" SERIAL NOT NULL,
    "rodeoId" INTEGER NOT NULL,
    "contactRole" TEXT NOT NULL,
    "officerRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RodeoContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rodeo_slug_tenantId_key" ON "Rodeo"("slug", "tenantId");

-- AddForeignKey
ALTER TABLE "Rodeo" ADD CONSTRAINT "Rodeo_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rodeo" ADD CONSTRAINT "Rodeo_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rodeo" ADD CONSTRAINT "Rodeo_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rodeo" ADD CONSTRAINT "Rodeo_callInPolicyId_fkey" FOREIGN KEY ("callInPolicyId") REFERENCES "CallInPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodeoScheduleItem" ADD CONSTRAINT "RodeoScheduleItem_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES "Rodeo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodeoContact" ADD CONSTRAINT "RodeoContact_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES "Rodeo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES "Rodeo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
