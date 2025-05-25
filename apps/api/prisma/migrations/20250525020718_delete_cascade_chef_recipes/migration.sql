-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_chefUserId_fkey";

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
