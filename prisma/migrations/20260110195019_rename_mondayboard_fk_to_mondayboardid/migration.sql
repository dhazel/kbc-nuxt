-- AlterTable
ALTER TABLE "board_mappings" RENAME COLUMN "mondayBoard_fk" TO "mondayBoardId";

-- DropIndex
DROP INDEX "board_mappings_subscriptionId_threadTypeId_mondayBoard_fk_key";

-- DropForeignKey
ALTER TABLE "board_mappings" DROP CONSTRAINT "board_mappings_mondayBoard_fk_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "board_mappings_subscriptionId_threadTypeId_mondayBoardId_key" ON "board_mappings"("subscriptionId", "threadTypeId", "mondayBoardId");

-- AddForeignKey
ALTER TABLE "board_mappings" ADD CONSTRAINT "board_mappings_mondayBoardId_fkey" FOREIGN KEY ("mondayBoardId") REFERENCES "monday_boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
