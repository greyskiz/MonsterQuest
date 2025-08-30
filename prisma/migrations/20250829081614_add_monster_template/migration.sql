/*
  Warnings:

  - You are about to drop the column `baseHpMinutes` on the `MonsterTemplate` table. All the data in the column will be lost.
  - Added the required column `minutes` to the `MonsterTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tier` to the `MonsterTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MonsterTemplate" DROP COLUMN "baseHpMinutes",
ADD COLUMN     "baseCoins" INTEGER,
ADD COLUMN     "minutes" INTEGER NOT NULL,
ADD COLUMN     "tier" TEXT NOT NULL;
