-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "subscriptionId" INTEGER;

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_name_key" ON "subscriptions"("name");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed initial subscriptions
INSERT INTO "subscriptions" ("name") VALUES
('Month-to-month Level 1'),
('Month-to-month Level 2'),
('Month-to-month Level 3'),
('Annual Level 1'),
('Annual Level 2'),
('Annual Level 3');
