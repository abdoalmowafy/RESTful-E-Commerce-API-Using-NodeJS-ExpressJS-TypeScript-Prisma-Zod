/*
  Warnings:

  - You are about to drop the `search` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `Return` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Return` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_userId_fkey";

-- AlterTable
ALTER TABLE "Return" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "search";

-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "keyWord" TEXT NOT NULL,
    "userId" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_orderId_productId_fkey" FOREIGN KEY ("orderId", "productId") REFERENCES "OrderItem"("orderId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
