-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_industryId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "industry" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_industry_fkey" FOREIGN KEY ("industry") REFERENCES "IndustryInsights"("industry") ON DELETE SET NULL ON UPDATE CASCADE;
