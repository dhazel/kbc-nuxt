-- AlterTable
ALTER TABLE "board_mappings" ADD COLUMN     "mondayBoard_fk" INTEGER;

-- CreateTable
CREATE TABLE "monday_boards" (
    "id" SERIAL NOT NULL,
    "mondayBoardId" BIGINT NOT NULL,
    "boardName" TEXT,
    "organizationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monday_boards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monday_boards_mondayBoardId_key" ON "monday_boards"("mondayBoardId");

-- Seed monday_boards from existing board_mappings
INSERT INTO monday_boards ("mondayBoardId", "boardName", "organizationId", "createdAt", "updatedAt")
SELECT DISTINCT "mondayBoardId", NULL::TEXT, NULL::INTEGER, NOW(), NOW()
FROM board_mappings
WHERE "mondayBoardId" IS NOT NULL;

-- Populate FK in board_mappings
UPDATE board_mappings
SET "mondayBoard_fk" = mb.id
FROM monday_boards mb
WHERE board_mappings."mondayBoardId" = mb."mondayBoardId";

-- Drop old column
ALTER TABLE "board_mappings" DROP COLUMN "mondayBoardId";

-- Add new unique index
CREATE UNIQUE INDEX "board_mappings_subscriptionId_threadTypeId_mondayBoard_fk_key" ON "board_mappings"("subscriptionId", "threadTypeId", "mondayBoard_fk");

-- AddForeignKey
ALTER TABLE "board_mappings" ADD CONSTRAINT "board_mappings_mondayBoard_fk_fkey" FOREIGN KEY ("mondayBoard_fk") REFERENCES "monday_boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monday_boards" ADD CONSTRAINT "monday_boards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
