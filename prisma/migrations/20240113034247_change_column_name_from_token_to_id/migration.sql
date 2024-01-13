/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `id` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "token",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");
