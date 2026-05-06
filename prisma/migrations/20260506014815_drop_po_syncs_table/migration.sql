/*
  Warnings:

  - You are about to drop the `monday_prayer_order_syncs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "monday_prayer_order_syncs" DROP CONSTRAINT "monday_prayer_order_syncs_mondayBoardId_fkey";

-- DropTable
DROP TABLE "monday_prayer_order_syncs";
