-- CreateEnum
CREATE TYPE "SponsorshipLevel" AS ENUM ('PREMIER', 'FEATURED', 'STANDARD', 'SUPPORTER');

-- CreateEnum
CREATE TYPE "PlacementZone" AS ENUM ('HEADER', 'STRIP', 'SIDEBAR', 'FOOTER', 'INLINE');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('ATHLETE', 'EVENT', 'LOCATION', 'GALLERY', 'ANNOUNCEMENT', 'SEASON');

-- DropForeignKey
ALTER TABLE "AthleteSponsor" DROP CONSTRAINT "AthleteSponsor_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "AthleteSponsor" DROP CONSTRAINT "AthleteSponsor_sponsorId_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "type",
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "mode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "tier";

-- DropTable
DROP TABLE "AthleteSponsor";

-- DropEnum
DROP TYPE "SponsorTier";

-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" SERIAL NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "level" "SponsorshipLevel" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentType",
    "contentId" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sponsorship_contentType_contentId_idx" ON "Sponsorship"("contentType", "contentId");

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

