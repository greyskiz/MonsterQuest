/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MonsterTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,monsterId]` on the table `UserMonsterDefeat` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Encounter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Encounter" DROP COLUMN "status",
ADD COLUMN     "status" "public"."EncounterStatus" NOT NULL;

-- CreateTable
CREATE TABLE "public"."EncounterParticipant" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncounterParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EncounterParticipant_userId_idx" ON "public"."EncounterParticipant"("userId");

-- CreateIndex
CREATE INDEX "EncounterParticipant_encounterId_idx" ON "public"."EncounterParticipant"("encounterId");

-- CreateIndex
CREATE UNIQUE INDEX "EncounterParticipant_encounterId_userId_key" ON "public"."EncounterParticipant"("encounterId", "userId");

-- CreateIndex
CREATE INDEX "Encounter_userId_idx" ON "public"."Encounter"("userId");

-- CreateIndex
CREATE INDEX "Encounter_monsterId_idx" ON "public"."Encounter"("monsterId");

-- CreateIndex
CREATE INDEX "Encounter_status_idx" ON "public"."Encounter"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MonsterTemplate_name_key" ON "public"."MonsterTemplate"("name");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "UserMonsterDefeat_userId_idx" ON "public"."UserMonsterDefeat"("userId");

-- CreateIndex
CREATE INDEX "UserMonsterDefeat_monsterId_idx" ON "public"."UserMonsterDefeat"("monsterId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMonsterDefeat_userId_monsterId_key" ON "public"."UserMonsterDefeat"("userId", "monsterId");

-- AddForeignKey
ALTER TABLE "public"."EncounterParticipant" ADD CONSTRAINT "EncounterParticipant_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "public"."Encounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EncounterParticipant" ADD CONSTRAINT "EncounterParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
