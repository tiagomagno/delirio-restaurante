-- AlterTable
ALTER TABLE `Store` ADD COLUMN `extraRecipients` JSON NULL;

-- CreateTable
CREATE TABLE `JobApplication` (
    `id` VARCHAR(191) NOT NULL,
    `lojaEmail` VARCHAR(191) NOT NULL,
    `lojaNome` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `vaga` VARCHAR(191) NOT NULL,
    `mensagem` TEXT NULL,
    `curriculoUrl` TEXT NOT NULL,
    `curriculoNome` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
