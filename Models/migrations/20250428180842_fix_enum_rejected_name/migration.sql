/*
  Warnings:

  - The values [REJECTRED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REJECTRED] on the enum `ReturnStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PAYING', 'PROCESSING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED', 'REJECTED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReturnStatus_new" AS ENUM ('PROCESSING', 'ON_THE_WAY', 'RETURNED', 'CANCELLED', 'REJECTED');
ALTER TABLE "Return" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Return" ALTER COLUMN "status" TYPE "ReturnStatus_new" USING ("status"::text::"ReturnStatus_new");
ALTER TYPE "ReturnStatus" RENAME TO "ReturnStatus_old";
ALTER TYPE "ReturnStatus_new" RENAME TO "ReturnStatus";
DROP TYPE "ReturnStatus_old";
ALTER TABLE "Return" ALTER COLUMN "status" SET DEFAULT 'PROCESSING';
COMMIT;
