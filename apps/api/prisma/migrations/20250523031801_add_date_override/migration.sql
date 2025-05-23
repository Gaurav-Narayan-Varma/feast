-- CreateTable
CREATE TABLE "DateOverride" (
    "id" TEXT NOT NULL,
    "chefUserId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateOverride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DateOverride" ADD CONSTRAINT "DateOverride_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
