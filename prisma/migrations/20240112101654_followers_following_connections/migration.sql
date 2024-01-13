-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connections" TEXT[],
ADD COLUMN     "followers" TEXT[],
ADD COLUMN     "following" TEXT[];
