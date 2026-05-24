/*
  Warnings:

  - You are about to drop the column `connections` on the `ConnectionGroup` table. All the data in the column will be lost.
  - You are about to drop the column `traits` on the `ConnectionGroup` table. All the data in the column will be lost.
  - You are about to drop the column `visibleGroups` on the `Trait` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConnectionGroup" DROP COLUMN "connections",
DROP COLUMN "traits";

-- AlterTable
ALTER TABLE "Trait" DROP COLUMN "visibleGroups";

-- CreateTable
CREATE TABLE "_ConnectionToConnectionGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConnectionToConnectionGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ConnectionGroupToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConnectionGroupToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConnectionToConnectionGroup_B_index" ON "_ConnectionToConnectionGroup"("B");

-- CreateIndex
CREATE INDEX "_ConnectionGroupToTrait_B_index" ON "_ConnectionGroupToTrait"("B");

-- AddForeignKey
ALTER TABLE "_ConnectionToConnectionGroup" ADD CONSTRAINT "_ConnectionToConnectionGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectionToConnectionGroup" ADD CONSTRAINT "_ConnectionToConnectionGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "ConnectionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectionGroupToTrait" ADD CONSTRAINT "_ConnectionGroupToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "ConnectionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectionGroupToTrait" ADD CONSTRAINT "_ConnectionGroupToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
