/*
  Warnings:

  - You are about to drop the column `coinsBalance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leaderboardVis` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "coinsBalance",
DROP COLUMN "leaderboardVis",
DROP COLUMN "timezone",
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
