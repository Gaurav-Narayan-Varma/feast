/*
  Warnings:

  - Made the column `timeCustomerRequestedAt` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalAmount" DROP NOT NULL,
ALTER COLUMN "paymentStatus" DROP NOT NULL,
ALTER COLUMN "stripeSessionId" DROP NOT NULL,
ALTER COLUMN "timeCustomerRequestedAt" SET NOT NULL;
