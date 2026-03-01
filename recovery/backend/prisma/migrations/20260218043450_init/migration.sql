/*
  Warnings:

  - The values [SECOND_VICE_PESIDENT] on the enum `OfficerRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OfficerRole_new" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'SECOND_VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'POINTS_SECRETARY', 'NATIONAL_DIRECTOR', 'STATE_DIRECTOR', 'REGION_DIRECTOR', 'BOARD_MEMBER', 'STUDENT_PRESIDENT', 'STUDENT_VICE_PRESIDENT', 'STUDENT_SECRETARY', 'QUEEN', 'JH_PRINCESS');
ALTER TABLE "Officer" ALTER COLUMN "role" TYPE "OfficerRole_new" USING ("role"::text::"OfficerRole_new");
ALTER TYPE "OfficerRole" RENAME TO "OfficerRole_old";
ALTER TYPE "OfficerRole_new" RENAME TO "OfficerRole";
DROP TYPE "public"."OfficerRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Sponsor" ALTER COLUMN "logoUrl" DROP NOT NULL;
