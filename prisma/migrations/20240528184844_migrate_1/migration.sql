-- CreateTable
CREATE TABLE `frame_designs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `typeId` INTEGER NULL,

    INDEX `fk_frame_design_type`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `frame_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `frame_designs` ADD CONSTRAINT `fk_frame_design_type` FOREIGN KEY (`typeId`) REFERENCES `frame_types`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
