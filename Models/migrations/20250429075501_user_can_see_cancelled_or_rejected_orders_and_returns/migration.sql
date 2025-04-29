/*
  Warnings:

  - You are about to drop the column `deleted` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Return` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Return` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deleted",
DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Return" DROP COLUMN "deleted",
DROP COLUMN "deletedAt";
