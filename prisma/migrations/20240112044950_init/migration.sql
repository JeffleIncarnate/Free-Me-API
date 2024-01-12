-- CreateEnum
CREATE TYPE "Type" AS ENUM ('CLIENT', 'CONSULTANT', 'FREERIDER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GENERAL');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('BRONZE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fistname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "nzbn" BIGINT NOT NULL,
    "gst" BIGINT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profilePicture" TEXT NOT NULL,
    "background" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultant" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "values" TEXT[],
    "skills" TEXT[],
    "education" TEXT[],
    "ambitions" TEXT[],
    "awards" TEXT[],
    "hobbies" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Consultant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackConsultant" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "consultantId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackConsultant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackClient" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Consultant_userId_key" ON "Consultant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackConsultant_consultantId_key" ON "FeedbackConsultant"("consultantId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackClient_clientId_key" ON "FeedbackClient"("clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultant" ADD CONSTRAINT "Consultant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackConsultant" ADD CONSTRAINT "FeedbackConsultant_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackClient" ADD CONSTRAINT "FeedbackClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
