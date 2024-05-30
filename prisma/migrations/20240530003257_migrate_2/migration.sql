-- CreateTable
CREATE TABLE `frame_finalized` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `frameId` INTEGER NOT NULL,

    INDEX `fk_frame_design`(`frameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `frame_finalized` ADD CONSTRAINT `fk_frame_design` FOREIGN KEY (`frameId`) REFERENCES `frame_designs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
