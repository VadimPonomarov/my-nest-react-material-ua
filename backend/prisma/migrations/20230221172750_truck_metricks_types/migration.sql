/*
  Warnings:

  - You are about to alter the column `lat` on the `trucks` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `lng` on the `trucks` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `trucks` MODIFY `lat` VARCHAR(191) NULL,
    MODIFY `lng` VARCHAR(191) NULL;
