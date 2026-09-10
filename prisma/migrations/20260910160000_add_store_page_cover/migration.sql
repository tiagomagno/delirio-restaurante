-- AlterTable
ALTER TABLE `Store` ADD COLUMN `storeImage` TEXT NULL,
    ADD COLUMN `storeImageAlt` VARCHAR(191) NOT NULL DEFAULT '';
