-- CreateEnum
CREATE TYPE "public"."SponsorTier" AS ENUM ('TITLE', 'GOLD', 'SILVER', 'BRONZE', 'ATHLETE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."OfficerRole_new" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'SECOND_VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'POINTS_SECRETARY', 'NATIONAL_DIRECTOR', 'STATE_DIRECTOR', 'REGION_DIRECTOR', 'BOARD_MEMBER', 'STUDENT_PRESIDENT', 'STUDENT_VICE_PRESIDENT', 'STUDENT_SECRETARY', 'QUEEN', 'JH_PRINCESS');
ALTER TABLE "public"."Officer" ALTER COLUMN "role" TYPE "public"."OfficerRole_new" USING ("role"::text::"public"."OfficerRole_new");
ALTER TYPE "public"."OfficerRole" RENAME TO "OfficerRole_old";
ALTER TYPE "public"."OfficerRole_new" RENAME TO "OfficerRole";
DROP TYPE "OfficerRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Sponsorship" DROP CONSTRAINT "Sponsorship_sponsorId_fkey";

-- AlterTable
ALTER TABLE "public"."Sponsor" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tier" "public"."SponsorTier" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Announcement" ADD COLUMN     "type" TEXT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "mode" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Sponsorship";

-- DropEnum
DROP TYPE "public"."SponsorshipLevel";

-- DropEnum
DROP TYPE "public"."PlacementZone";

-- DropEnum
DROP TYPE "public"."ContentType";

-- CreateTable
CREATE TABLE "public"."AthleteSponsor" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthleteSponsor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AthleteSponsor_athleteId_sponsorId_key" ON "public"."AthleteSponsor"("athleteId" ASC, "sponsorId" ASC);

-- AddForeignKey
ALTER TABLE "public"."AthleteSponsor" ADD CONSTRAINT "AthleteSponsor_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AthleteSponsor" ADD CONSTRAINT "AthleteSponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

