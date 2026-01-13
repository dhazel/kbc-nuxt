/*
  Warnings:

  - A unique constraint covering the columns `[mondayId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_mondayId_key" ON "users"("mondayId");
