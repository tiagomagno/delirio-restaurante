-- AlterTable
ALTER TABLE `HeroSlide`
  ADD COLUMN `isSpecial` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `buttonLabel` TEXT NULL,
  ADD COLUMN `buttonUrl` TEXT NULL;
