-- CreateEnum
CREATE TYPE "AthleteEvent" AS ENUM ('BAREBACK', 'SADDLE_BRONC', 'BULL_RIDING', 'BARREL_RACING', 'POLE_BENDING', 'GOAT_TYING', 'BREAKAWAY_ROPING', 'TIE_DOWN_ROPING', 'TEAM_ROPING', 'STEER_WRESTLING', 'RANCH_SADDLE_BRONC', 'REINED_COW');

-- CreateTable
CREATE TABLE "Athlete" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "school" TEXT,
    "grade" TEXT,
    "hometown" TEXT,
    "bio" TEXT,
    "headshotUrl" TEXT,
    "actionPhotoUrl" TEXT,
    "seasonId" INTEGER NOT NULL,
    "events" "AthleteEvent"[],
    "standings" TEXT,
    "awards" JSONB,
    "futureGoals" TEXT,
    "sponsors" JSONB,
    "socialLinks" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
