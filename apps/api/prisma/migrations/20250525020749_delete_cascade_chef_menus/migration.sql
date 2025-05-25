-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_chefUserId_fkey";

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
