-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "profileEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Rodeo" ADD COLUMN     "goCount" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "RodeoEntry" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "rodeoId" INTEGER NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "event" "AthleteEvent" NOT NULL,
    "goNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RodeoEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsEntry" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "rodeoId" INTEGER NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,
    "event" "AthleteEvent" NOT NULL,
    "goNumber" INTEGER NOT NULL DEFAULT 1,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RodeoEntry_tenantId_seasonId_rodeoId_event_goNumber_idx" ON "RodeoEntry"("tenantId", "seasonId", "rodeoId", "event", "goNumber");

-- CreateIndex
CREATE INDEX "RodeoEntry_athleteId_idx" ON "RodeoEntry"("athleteId");

-- CreateIndex
CREATE UNIQUE INDEX "RodeoEntry_rodeoId_athleteId_event_goNumber_key" ON "RodeoEntry"("rodeoId", "athleteId", "event", "goNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PointsEntry_entryId_key" ON "PointsEntry"("entryId");

-- CreateIndex
CREATE INDEX "PointsEntry_tenantId_seasonId_rodeoId_event_goNumber_idx" ON "PointsEntry"("tenantId", "seasonId", "rodeoId", "event", "goNumber");

-- CreateIndex
CREATE INDEX "PointsEntry_athleteId_idx" ON "PointsEntry"("athleteId");

-- AddForeignKey
ALTER TABLE "RodeoEntry" ADD CONSTRAINT "RodeoEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodeoEntry" ADD CONSTRAINT "RodeoEntry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodeoEntry" ADD CONSTRAINT "RodeoEntry_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES "Rodeo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodeoEntry" ADD CONSTRAINT "RodeoEntry_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsEntry" ADD CONSTRAINT "PointsEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsEntry" ADD CONSTRAINT "PointsEntry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsEntry" ADD CONSTRAINT "PointsEntry_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES "Rodeo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsEntry" ADD CONSTRAINT "PointsEntry_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsEntry" ADD CONSTRAINT "PointsEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RodeoEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
