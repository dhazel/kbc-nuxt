/*
  Warnings:

  - You are about to drop the column `threadId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `prayer_orders` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `prayer_orders` table. All the data in the column will be lost.
  - You are about to drop the `threads` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prayerOrderId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `prayer_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstMessageContent` to the `prayer_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `prayer_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_threadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."prayer_orders" DROP CONSTRAINT "prayer_orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."threads" DROP CONSTRAINT "threads_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."threads" DROP CONSTRAINT "threads_typeId_fkey";

-- DropIndex
DROP INDEX "public"."messages_threadId_createdAt_idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "threadId",
ADD COLUMN     "prayerOrderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "prayer_orders" DROP COLUMN "body",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "firstMessageContent" TEXT NOT NULL,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "typeId" INTEGER NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."threads";

-- CreateIndex
CREATE INDEX "messages_prayerOrderId_createdAt_idx" ON "messages"("prayerOrderId", "createdAt");

-- CreateIndex
CREATE INDEX "prayer_orders_creatorId_idx" ON "prayer_orders"("creatorId");

-- CreateIndex
CREATE INDEX "prayer_orders_createdAt_idx" ON "prayer_orders"("createdAt");

-- CreateIndex
CREATE INDEX "prayer_orders_typeId_idx" ON "prayer_orders"("typeId");

-- AddForeignKey
ALTER TABLE "prayer_orders" ADD CONSTRAINT "prayer_orders_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_orders" ADD CONSTRAINT "prayer_orders_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "thread_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_prayerOrderId_fkey" FOREIGN KEY ("prayerOrderId") REFERENCES "prayer_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
