-- CreateEnum
CREATE TYPE "Form1099Status" AS ENUM ('NotStarted', 'Submitted', 'Approved');

-- AlterTable
ALTER TABLE "ChefUser" ADD COLUMN     "form1099DocumentKey" TEXT,
ADD COLUMN     "form1099Status" "Form1099Status" NOT NULL DEFAULT 'NotStarted';
