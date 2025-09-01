/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `imageAlt` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `imageAlt` on the `TrueValueModel` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `TrueValueModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `TrueValueModel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Banner_order_key";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "createdAt",
DROP COLUMN "imageAlt",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "TrueValueModel" DROP COLUMN "imageAlt",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banner_imageId_key" ON "Banner"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "TrueValueModel_imageId_key" ON "TrueValueModel"("imageId");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrueValueModel" ADD CONSTRAINT "TrueValueModel_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
