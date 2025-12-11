-- DropForeignKey
ALTER TABLE "public"."prayer_orders" DROP CONSTRAINT "prayer_orders_userId_fkey";

-- CreateTable
CREATE TABLE "threads" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "title" TEXT,
    "firstMessageContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "threadId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "thread_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "threads_creatorId_idx" ON "threads"("creatorId");

-- CreateIndex
CREATE INDEX "threads_createdAt_idx" ON "threads"("createdAt");

-- CreateIndex
CREATE INDEX "threads_typeId_idx" ON "threads"("typeId");

-- CreateIndex
CREATE INDEX "messages_threadId_createdAt_idx" ON "messages"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_authorId_idx" ON "messages"("authorId");

-- CreateIndex
CREATE INDEX "messages_deletedAt_idx" ON "messages"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "thread_types_name_key" ON "thread_types"("name");

-- AddForeignKey
ALTER TABLE "prayer_orders" ADD CONSTRAINT "prayer_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "thread_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert initial thread types
INSERT INTO "thread_types" ("name", "description") VALUES
('Informed Intercession', 'Threads based on informed prayer requests'),
('Inspired Intercession', 'Threads based on inspired or spontaneous prayer');
