/*
  Warnings:

  - Added the required column `deliveryNeeded` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Return" ADD COLUMN     "deliveryNeeded" BOOLEAN NOT NULL;
