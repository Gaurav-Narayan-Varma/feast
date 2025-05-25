-- DropForeignKey
ALTER TABLE "DateOverride" DROP CONSTRAINT "DateOverride_chefUserId_fkey";

-- AddForeignKey
ALTER TABLE "DateOverride" ADD CONSTRAINT "DateOverride_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
