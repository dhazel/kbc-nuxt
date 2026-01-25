-- CreateTable
CREATE TABLE "statuses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_order_statuses" (
    "prayerOrderId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "statuses_name_key" ON "statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_order_statuses_prayerOrderId_statusId_key" ON "prayer_order_statuses"("prayerOrderId", "statusId");

-- AddForeignKey
ALTER TABLE "prayer_order_statuses" ADD CONSTRAINT "prayer_order_statuses_prayerOrderId_fkey" FOREIGN KEY ("prayerOrderId") REFERENCES "prayer_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_order_statuses" ADD CONSTRAINT "prayer_order_statuses_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "statuses" ("name") VALUES
('Ongoing'),
('Urgent'),
('Closed'),
('Paused'),
('Reviewed');
