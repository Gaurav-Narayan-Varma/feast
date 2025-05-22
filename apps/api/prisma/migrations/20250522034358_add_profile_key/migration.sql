/*
  Warnings:

  - You are about to drop the column `profileImage` on the `ChefUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChefUser" DROP COLUMN "profileImage",
ADD COLUMN     "profilePictureKey" TEXT;
