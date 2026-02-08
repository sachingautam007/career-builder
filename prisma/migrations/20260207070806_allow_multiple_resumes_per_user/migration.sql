-- DropIndex
DROP INDEX "Resume_userId_key";

-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "content" DROP NOT NULL;
