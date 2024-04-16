/*
  Warnings:

  - Added the required column `roomCapacity` to the `Lodgings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lodgings" ADD COLUMN     "roomCapacity" INTEGER NOT NULL;
