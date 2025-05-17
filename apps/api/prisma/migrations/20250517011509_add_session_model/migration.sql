-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chefUserId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_chefUserId_id_idx" ON "Session"("chefUserId", "id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_chefUserId_fkey" FOREIGN KEY ("chefUserId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
