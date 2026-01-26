/*
  Warnings:

  - You are about to drop the column `assignmentRules` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `hookupInfo` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `stallInfo` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "assignmentRules",
DROP COLUMN "hookupInfo",
DROP COLUMN "notes",
DROP COLUMN "stallInfo",
ADD COLUMN     "venueInfo" JSONB;

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "seasonId" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "extras" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishAt" TIMESTAMP(3),
    "expireAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
