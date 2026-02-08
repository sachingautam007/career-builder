-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "avoidKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
