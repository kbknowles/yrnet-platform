-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('TITLE', 'GOLD', 'SILVER', 'BRONZE', 'ATHLETE');


-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "sponsors";

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tier" "SponsorTier" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "logoUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "AthleteSponsor" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthleteSponsor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AthleteSponsor_athleteId_sponsorId_key" ON "AthleteSponsor"("athleteId", "sponsorId");

-- AddForeignKey
ALTER TABLE "AthleteSponsor" ADD CONSTRAINT "AthleteSponsor_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthleteSponsor" ADD CONSTRAINT "AthleteSponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Athlete_slug_unique" RENAME TO "Athlete_slug_key";

