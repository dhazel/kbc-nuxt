/*
  Warnings:

  - You are about to drop the column `description` on the `general_syncs` table. All the data in the column will be lost.
  - Added the required column `syncType` to the `general_syncs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SyncType" AS ENUM ('MondayMessages', 'MondayPrayerOrders');

-- AlterTable
ALTER TABLE "general_syncs" DROP COLUMN "description",
ADD COLUMN     "syncType" "SyncType" NOT NULL;
