/*
  Warnings:

  - You are about to drop the column `emailAlias` on the `Officer` table. All the data in the column will be lost.
  - Changed the type of `role` on the `Officer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Officer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OfficerRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'SECOND_VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'POINTS_SECRETARY', 'NATIONAL_DIRECTOR', 'STATE_DIRECTOR', 'REGION_DIRECTOR', 'BOARD_MEMBER', 'STUDENT_PRESIDENT', 'STUDENT_VICE_PRESIDENT', 'STUDENT_SECRETARY', 'QUEEN', 'JH_PRINCESS');

-- CreateEnum
CREATE TYPE "OfficerType" AS ENUM ('EXECUTIVE', 'DIRECTOR', 'STUDENT', 'STAFF');

-- AlterTable
ALTER TABLE "Officer" DROP COLUMN "emailAlias",
ADD COLUMN     "email" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "OfficerRole" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "OfficerType" NOT NULL;
