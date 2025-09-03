/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `lastBeat` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `plannedMinutes` on the `Encounter` table. All the data in the column will be lost.
  - Added the required column `plannedDuration` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Encounter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Encounter" DROP COLUMN "endedAt",
DROP COLUMN "lastBeat",
DROP COLUMN "plannedMinutes",
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "plannedDuration" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;
