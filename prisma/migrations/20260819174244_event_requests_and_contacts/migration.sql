-- CreateTable
CREATE TABLE `EventRequest` (
    `id` VARCHAR(191) NOT NULL,
    `lojaEmail` VARCHAR(191) NOT NULL,
    `lojaNome` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `pessoas` INTEGER NOT NULL,
    `data` DATETIME(3) NULL,
    `telefone` VARCHAR(191) NULL,
    `celular` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `descricao` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `lojaEmail` VARCHAR(191) NOT NULL,
    `lojaNome` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `celular` VARCHAR(191) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
