/*
  Warnings:

  - You are about to drop the column `atsScore` on the `Resume` table. All the data in the column will be lost.
  - The `feedback` column on the `Resume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `breakdown` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawText` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceType` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResumeSourceType" AS ENUM ('PASTE', 'UPLOAD');

-- CreateEnum
CREATE TYPE "ResumeLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "atsScore",
ADD COLUMN     "breakdown" JSONB NOT NULL,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "level" "ResumeLevel" NOT NULL,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rawText" TEXT NOT NULL,
ADD COLUMN     "sourceType" "ResumeSourceType" NOT NULL,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "wordCount" INTEGER,
DROP COLUMN "feedback",
ADD COLUMN     "feedback" TEXT[];

-- CreateIndex
CREATE INDEX "Resume_userId_createdAt_idx" ON "Resume"("userId", "createdAt");
