/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingTime` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `appointmentAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingDate",
DROP COLUMN "bookingTime",
ADD COLUMN     "appointmentAt" TIMESTAMP(3) NOT NULL;
