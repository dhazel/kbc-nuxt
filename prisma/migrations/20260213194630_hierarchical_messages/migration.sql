-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "parentMessageId" INTEGER;

-- CreateTable
CREATE TABLE "general_syncs" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "general_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_parentMessageId_idx" ON "messages"("parentMessageId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
