/*
  Warnings:

  - You are about to drop the column `hpRemaining` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `partyId` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `scopeType` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Encounter` table. All the data in the column will be lost.
  - The `status` column on the `Encounter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `scopeId` on the `MonsterTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `encounterId` on the `UserMonsterDefeat` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `UserMonsterDefeat` table. All the data in the column will be lost.
  - You are about to drop the `MonsterScope` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartyMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `monsterId` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plannedMinutes` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Encounter` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `scope` to the `MonsterTemplate` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tier` on the `MonsterTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `monsterId` to the `UserMonsterDefeat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Tier" AS ENUM ('QUICK', 'STANDARD', 'LONG');

-- CreateEnum
CREATE TYPE "public"."Scope" AS ENUM ('SOLO', 'PARTY');

-- CreateEnum
CREATE TYPE "public"."EncounterStatus" AS ENUM ('ONGOING', 'PAUSED', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_partyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MonsterTemplate" DROP CONSTRAINT "MonsterTemplate_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Party" DROP CONSTRAINT "Party_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PartyMember" DROP CONSTRAINT "PartyMember_partyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PartyMember" DROP CONSTRAINT "PartyMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySession" DROP CONSTRAINT "StudySession_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySession" DROP CONSTRAINT "StudySession_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserMonsterDefeat" DROP CONSTRAINT "UserMonsterDefeat_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserMonsterDefeat" DROP CONSTRAINT "UserMonsterDefeat_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Encounter" DROP COLUMN "hpRemaining",
DROP COLUMN "partyId",
DROP COLUMN "scopeType",
DROP COLUMN "templateId",
ADD COLUMN     "elapsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "lastBeat" TIMESTAMP(3),
ADD COLUMN     "monsterId" TEXT NOT NULL,
ADD COLUMN     "plannedMinutes" INTEGER NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."EncounterStatus" NOT NULL DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE "public"."MonsterTemplate" DROP COLUMN "scopeId",
ADD COLUMN     "scope" "public"."Scope" NOT NULL,
DROP COLUMN "tier",
ADD COLUMN     "tier" "public"."Tier" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "displayName" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "public"."UserMonsterDefeat" DROP COLUMN "encounterId",
DROP COLUMN "templateId",
ADD COLUMN     "monsterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."MonsterScope";

-- DropTable
DROP TABLE "public"."Party";

-- DropTable
DROP TABLE "public"."PartyMember";

-- DropTable
DROP TABLE "public"."StudySession";

-- AddForeignKey
ALTER TABLE "public"."Encounter" ADD CONSTRAINT "Encounter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Encounter" ADD CONSTRAINT "Encounter_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "public"."MonsterTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMonsterDefeat" ADD CONSTRAINT "UserMonsterDefeat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMonsterDefeat" ADD CONSTRAINT "UserMonsterDefeat_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "public"."MonsterTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
