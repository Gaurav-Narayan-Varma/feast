-- AlterTable
ALTER TABLE "ChefUser" ADD COLUMN     "isIdVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeVerificationSessionId" TEXT;
