-- =============================
-- ENUMS
-- =============================

DO $$ BEGIN
    CREATE TYPE "SponsorshipLevel" AS ENUM ('PREMIER', 'FEATURED', 'STANDARD', 'SUPPORTER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PlacementZone" AS ENUM ('HEADER', 'STRIP', 'SIDEBAR', 'FOOTER', 'INLINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ContentType" AS ENUM ('ATHLETE', 'EVENT', 'LOCATION', 'GALLERY', 'ANNOUNCEMENT', 'SEASON');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================
-- REMOVE OLD ATHLETE SPONSOR SYSTEM
-- =============================

ALTER TABLE IF EXISTS "AthleteSponsor"
DROP CONSTRAINT IF EXISTS "AthleteSponsor_athleteId_fkey";

ALTER TABLE IF EXISTS "AthleteSponsor"
DROP CONSTRAINT IF EXISTS "AthleteSponsor_sponsorId_fkey";

DROP TABLE IF EXISTS "AthleteSponsor";

-- =============================
-- CLEAN UP SPONSOR TABLE
-- =============================

ALTER TABLE "Sponsor"
DROP COLUMN IF EXISTS "endDate",
DROP COLUMN IF EXISTS "startDate",
DROP COLUMN IF EXISTS "tier";

DROP TYPE IF EXISTS "SponsorTier";

-- =============================
-- ANNOUNCEMENT ADJUSTMENTS
-- =============================

ALTER TABLE "Announcement"
DROP COLUMN IF EXISTS "type";

ALTER TABLE "Announcement"
ALTER COLUMN "content" DROP NOT NULL;

ALTER TABLE "Announcement"
ALTER COLUMN "mode" SET NOT NULL;

-- =============================
-- CREATE NEW SPONSORSHIP TABLE
-- =============================

CREATE TABLE IF NOT EXISTS "Sponsorship" (
    "id" SERIAL PRIMARY KEY,
    "sponsorId" INTEGER NOT NULL,
    "level" "SponsorshipLevel" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentType",
    "contentId" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "Sponsorship_contentType_contentId_idx"
ON "Sponsorship"("contentType", "contentId");

ALTER TABLE "Sponsorship"
ADD CONSTRAINT "Sponsorship_sponsorId_fkey"
FOREIGN KEY ("sponsorId")
REFERENCES "Sponsor"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
