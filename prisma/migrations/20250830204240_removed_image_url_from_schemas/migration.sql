/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `TrueValueModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "TrueValueModel" DROP COLUMN "imageUrl";
