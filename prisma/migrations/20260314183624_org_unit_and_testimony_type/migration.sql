-- AlterTable
ALTER TABLE "prayer_orders" ADD COLUMN     "organizationUnitId" INTEGER;

-- CreateTable
CREATE TABLE "organization_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "organization_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimony_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "testimony_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PrayerOrderToTestimonyType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PrayerOrderToTestimonyType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "testimony_types_name_key" ON "testimony_types"("name");

-- CreateIndex
CREATE INDEX "_PrayerOrderToTestimonyType_B_index" ON "_PrayerOrderToTestimonyType"("B");

-- AddForeignKey
ALTER TABLE "organization_units" ADD CONSTRAINT "organization_units_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_orders" ADD CONSTRAINT "prayer_orders_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "organization_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrayerOrderToTestimonyType" ADD CONSTRAINT "_PrayerOrderToTestimonyType_A_fkey" FOREIGN KEY ("A") REFERENCES "prayer_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrayerOrderToTestimonyType" ADD CONSTRAINT "_PrayerOrderToTestimonyType_B_fkey" FOREIGN KEY ("B") REFERENCES "testimony_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed TestimonyType data
INSERT INTO testimony_types (name) VALUES
  ('Healing'),
  ('Corporate'),
  ('Financial'),
  ('Provision'),
  ('Spiritual')
ON CONFLICT (name) DO NOTHING;
