/*
  Warnings:

  - You are about to drop the column `PaymobOrderId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'REJECTRED';

-- AlterEnum
ALTER TYPE "ReturnStatus" ADD VALUE 'REJECTRED';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "PaymobOrderId",
ADD COLUMN     "paymobOrderId" TEXT;
