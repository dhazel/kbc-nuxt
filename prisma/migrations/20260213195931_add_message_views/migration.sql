-- CreateTable
CREATE TABLE "message_views" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3),

    CONSTRAINT "message_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_views_messageId_idx" ON "message_views"("messageId");

-- CreateIndex
CREATE INDEX "message_views_userId_idx" ON "message_views"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_views_messageId_userId_key" ON "message_views"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "message_views" ADD CONSTRAINT "message_views_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_views" ADD CONSTRAINT "message_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
