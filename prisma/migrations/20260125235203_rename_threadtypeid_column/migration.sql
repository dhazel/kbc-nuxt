/*
  Warnings:

  - You are about to drop the column `threadTypeId` on the `board_mappings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId,intercessionTypeId,mondayBoardId]` on the table `board_mappings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intercessionTypeId` to the `board_mappings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "board_mappings" DROP CONSTRAINT "board_mappings_threadTypeId_fkey";

-- DropIndex
DROP INDEX "board_mappings_subscriptionId_threadTypeId_mondayBoardId_key";

-- AlterTable
ALTER TABLE "board_mappings"
    RENAME COLUMN "threadTypeId" TO "intercessionTypeId";

-- CreateIndex
CREATE UNIQUE INDEX "board_mappings_subscriptionId_intercessionTypeId_mondayBoar_key" ON "board_mappings"("subscriptionId", "intercessionTypeId", "mondayBoardId");

-- AddForeignKey
ALTER TABLE "board_mappings" ADD CONSTRAINT "board_mappings_intercessionTypeId_fkey" FOREIGN KEY ("intercessionTypeId") REFERENCES "intercession_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
