-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Refunding', 'Refunded');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "bookingTime" TIMESTAMP(3) NOT NULL,
    "items" JSONB[],
    "stripeSessionId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "timeCustomerRequestedAt" TIMESTAMP(3),
    "timeChefAcceptedAt" TIMESTAMP(3),
    "timeChefRejectedAt" TIMESTAMP(3),
    "timeCustomerPaidAt" TIMESTAMP(3),
    "timeBookingCompletedAt" TIMESTAMP(3),
    "chefUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
