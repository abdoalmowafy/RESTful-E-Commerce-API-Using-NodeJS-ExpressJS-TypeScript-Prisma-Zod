/*
  Warnings:

  - The `status` column on the `Return` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `returnAddressId` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('PROCESSING', 'ON_THE_WAY', 'RETURNED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Return" ADD COLUMN     "returnAddressId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReturnStatus" NOT NULL DEFAULT 'PROCESSING';

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_returnAddressId_fkey" FOREIGN KEY ("returnAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
