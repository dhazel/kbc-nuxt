/*
  Warnings:

  - You are about to drop the column `prayerOrders` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `prayerResponses` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "prayerOrders",
DROP COLUMN "prayerResponses";
