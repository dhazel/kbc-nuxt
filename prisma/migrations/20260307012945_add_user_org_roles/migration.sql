/*
  Warnings:

  - You are about to drop the `_UserIntercessors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserOrganizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReactionType" ADD VALUE 'CLAP';
ALTER TYPE "ReactionType" ADD VALUE 'CELEBRATE';

-- DropForeignKey
ALTER TABLE "_UserIntercessors" DROP CONSTRAINT "_UserIntercessors_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserIntercessors" DROP CONSTRAINT "_UserIntercessors_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserOrganizations" DROP CONSTRAINT "_UserOrganizations_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserOrganizations" DROP CONSTRAINT "_UserOrganizations_B_fkey";

-- DropTable
DROP TABLE "_UserIntercessors";

-- DropTable
DROP TABLE "_UserOrganizations";

-- CreateTable
CREATE TABLE "user_roles_in_organization" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "user_roles_in_organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_in_organization_userId_roleId_organizationId_key" ON "user_roles_in_organization"("userId", "roleId", "organizationId");

-- AddForeignKey
ALTER TABLE "user_roles_in_organization" ADD CONSTRAINT "user_roles_in_organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_in_organization" ADD CONSTRAINT "user_roles_in_organization_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_in_organization" ADD CONSTRAINT "user_roles_in_organization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed new intercessor role                                                            
INSERT INTO roles (name) VALUES ('intercessor');                                       
