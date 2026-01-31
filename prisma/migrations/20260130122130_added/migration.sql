/*
  Warnings:

  - The primary key for the `Assessment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `score` on the `Assessment` table. All the data in the column will be lost.
  - The `questions` column on the `Assessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CoverLetter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `IndustryInsights` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `marketTrends` on the `IndustryInsights` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `IndustryInsights` table. All the data in the column will be lost.
  - You are about to drop the column `salaryRange` on the `IndustryInsights` table. All the data in the column will be lost.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `suggestions` on the `Resume` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `industryId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quizScore` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `demandLevel` on the `IndustryInsights` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `marketOutlook` on the `IndustryInsights` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_userId_fkey";

-- DropForeignKey
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- DropIndex
DROP INDEX "Resume_userId_idx";

-- AlterTable
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_pkey",
DROP COLUMN "score",
ADD COLUMN     "quizScore" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
DROP COLUMN "questions",
ADD COLUMN     "questions" JSONB[],
ADD CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_pkey",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "IndustryInsights" DROP CONSTRAINT "IndustryInsights_pkey",
DROP COLUMN "marketTrends",
DROP COLUMN "recommendations",
DROP COLUMN "salaryRange",
ADD COLUMN     "keyTrends" TEXT[],
ADD COLUMN     "recommendedSkills" TEXT[],
ADD COLUMN     "salaryRanges" JSONB[],
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "demandLevel",
ADD COLUMN     "demandLevel" TEXT NOT NULL,
DROP COLUMN "marketOutlook",
ADD COLUMN     "marketOutlook" TEXT NOT NULL,
ADD CONSTRAINT "IndustryInsights_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_pkey",
DROP COLUMN "suggestions",
ADD COLUMN     "feedback" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Resume_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "industryId",
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_key" ON "Resume"("userId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
