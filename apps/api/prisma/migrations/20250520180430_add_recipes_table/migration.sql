-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceRange" TEXT NOT NULL,
    "cuisines" TEXT[],
    "dietaryTags" TEXT[],
    "foodAllergens" TEXT[],
    "ingredients" JSONB[],
    "chefUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Recipe_chefUserId_idx" ON "Recipe"("chefUserId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
