-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DOCUMENT', 'FORM', 'RECIEPT');

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EntryType" NOT NULL,
    "date" TIMESTAMP(3),
    "amount" DOUBLE PRECISION,
    "pdfPath" TEXT,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);
