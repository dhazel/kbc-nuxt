-- CreateTable
CREATE TABLE "monday_prayer_order_syncs" (
    "id" SERIAL NOT NULL,
    "mondayBoardId" INTEGER NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monday_prayer_order_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monday_prayer_order_syncs_mondayBoardId_key" ON "monday_prayer_order_syncs"("mondayBoardId");

-- CreateIndex
CREATE INDEX "monday_prayer_order_syncs_mondayBoardId_idx" ON "monday_prayer_order_syncs"("mondayBoardId");

-- AddForeignKey
ALTER TABLE "monday_prayer_order_syncs" ADD CONSTRAINT "monday_prayer_order_syncs_mondayBoardId_fkey" FOREIGN KEY ("mondayBoardId") REFERENCES "monday_boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
