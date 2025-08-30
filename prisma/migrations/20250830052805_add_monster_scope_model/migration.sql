/*
  Warnings:

  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MonsterTemplate" ADD COLUMN     "scopeId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."MonsterScope" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MonsterScope_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MonsterTemplate" ADD CONSTRAINT "MonsterTemplate_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "public"."MonsterScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;
