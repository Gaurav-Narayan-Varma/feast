-- CreateTable
CREATE TABLE "RecurringAvailability" (
    "id" TEXT NOT NULL,
    "chefUserId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecurringAvailability" ADD CONSTRAINT "RecurringAvailability_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
