/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ChefUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ChefUser_email_emailVerified_key";

-- CreateIndex
CREATE UNIQUE INDEX "ChefUser_email_key" ON "ChefUser"("email");
