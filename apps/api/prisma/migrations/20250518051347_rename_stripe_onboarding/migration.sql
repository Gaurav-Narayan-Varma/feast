/*
  Warnings:

  - You are about to drop the column `stripeAccountOnboardingComplete` on the `ChefUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChefUser" DROP COLUMN "stripeAccountOnboardingComplete",
ADD COLUMN     "stripeOnboardingComplete" BOOLEAN NOT NULL DEFAULT false;
