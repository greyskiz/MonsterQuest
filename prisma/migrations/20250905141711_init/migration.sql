/*
  Warnings:

  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,inventoryItemId]` on the table `UserInventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Avatar" DROP CONSTRAINT "Avatar_bodyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Avatar" DROP CONSTRAINT "Avatar_headId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Avatar" DROP CONSTRAINT "Avatar_weaponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInventory" DROP CONSTRAINT "UserInventory_inventoryItemId_fkey";

-- AlterTable
ALTER TABLE "public"."Avatar" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "headId" DROP NOT NULL,
ALTER COLUMN "bodyId" DROP NOT NULL,
ALTER COLUMN "weaponId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."InventoryItem";

-- CreateTable
CREATE TABLE "public"."shopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rarity" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_userId_inventoryItemId_key" ON "public"."UserInventory"("userId", "inventoryItemId");

-- AddForeignKey
ALTER TABLE "public"."UserInventory" ADD CONSTRAINT "UserInventory_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."shopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_headId_fkey" FOREIGN KEY ("headId") REFERENCES "public"."shopItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_bodyId_fkey" FOREIGN KEY ("bodyId") REFERENCES "public"."shopItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "public"."shopItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
