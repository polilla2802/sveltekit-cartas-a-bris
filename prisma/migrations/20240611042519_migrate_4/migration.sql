/*
  Warnings:

  - Added the required column `updatedAt` to the `frame_designs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `frame_finalized` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `frame_designs` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `frame_finalized` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
