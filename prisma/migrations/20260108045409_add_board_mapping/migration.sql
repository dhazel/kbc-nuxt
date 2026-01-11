-- CreateTable
CREATE TABLE "board_mappings" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "threadTypeId" INTEGER NOT NULL,
    "mondayBoardId" BIGINT NOT NULL,

    CONSTRAINT "board_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_mappings_subscriptionId_threadTypeId_mondayBoardId_key" ON "board_mappings"("subscriptionId", "threadTypeId", "mondayBoardId");

-- AddForeignKey
ALTER TABLE "board_mappings" ADD CONSTRAINT "board_mappings_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_mappings" ADD CONSTRAINT "board_mappings_threadTypeId_fkey" FOREIGN KEY ("threadTypeId") REFERENCES "thread_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed Board Mappings
-- Month-to-month Informed (subscriptions 1,2,3; threadType 1)
INSERT INTO "board_mappings" ("subscriptionId", "threadTypeId", "mondayBoardId") VALUES
(1, 1, 18130780948),
(1, 1, 9731839830),
(1, 1, 9675066534),
(1, 1, 9913642037),
(1, 1, 18080835095),
(1, 1, 18391341242),
(2, 1, 18107014606),
(3, 1, 9804560302),
(3, 1, 18391844201);

-- Month-to-month Inspired (subscriptions 1,2,3; threadType 2)
INSERT INTO "board_mappings" ("subscriptionId", "threadTypeId", "mondayBoardId") VALUES
(1, 2, 18130780948),
(1, 2, 9731839830),
(1, 2, 9675066534),
(1, 2, 9913642037),
(1, 2, 18080835095),
(1, 2, 18391341242),
(2, 2, 18107014606),
(3, 2, 9804560302),
(3, 2, 18391844201);

-- Annual Informed (subscriptions 4,5,6; threadType 1)
INSERT INTO "board_mappings" ("subscriptionId", "threadTypeId", "mondayBoardId") VALUES
(4, 1, 5250873809),
(4, 1, 8747424435),
(4, 1, 18213975268),
(4, 1, 9183242337),
(4, 1, 18391558969);

-- Annual Inspired (subscriptions 4,5,6; threadType 2)
INSERT INTO "board_mappings" ("subscriptionId", "threadTypeId", "mondayBoardId") VALUES
(4, 2, 3938663417),
(4, 2, 8747424404),
(4, 2, 18213991693),
(4, 2, 18391559101);
