-- AlterTable
ALTER TABLE "monday_boards" ADD COLUMN     "mondayId" TEXT NULL;

UPDATE "monday_boards" SET "mondayId" = "mondayBoardId"::text;

ALTER TABLE "monday_boards" ALTER COLUMN "mondayId" SET NOT NULL;

DROP INDEX "monday_boards_mondayBoardId_key";

CREATE UNIQUE INDEX "monday_boards_mondayId_key" ON "monday_boards"("mondayId");

ALTER TABLE "monday_boards" DROP COLUMN "mondayBoardId";
