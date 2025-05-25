-- DropForeignKey
ALTER TABLE "RecurringAvailability" DROP CONSTRAINT "RecurringAvailability_chefUserId_fkey";

-- AddForeignKey
ALTER TABLE "RecurringAvailability" ADD CONSTRAINT "RecurringAvailability_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
