/*
  Warnings:

  - Added the required column `socialMedia` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `Consultant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "ambitions" TEXT[],
ADD COLUMN     "awards" TEXT[],
ADD COLUMN     "socialMedia" JSONB NOT NULL,
ADD COLUMN     "timeline" JSONB NOT NULL,
ADD COLUMN     "values" TEXT[];

-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "timeline" JSONB NOT NULL;
