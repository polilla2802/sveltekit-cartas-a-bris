-- Step 1: Add the new column 'designId' without dropping 'frameId' to preserve data
ALTER TABLE `frame_finalized` ADD COLUMN `designId` INTEGER;

-- Step 2: Update the 'designId' with the values from 'frameId'
UPDATE `frame_finalized` SET `designId` = `frameId`;

-- Step 3: Make 'designId' not nullable
ALTER TABLE `frame_finalized` MODIFY COLUMN `designId` INTEGER NOT NULL;

-- Step 4: Drop the old foreign key constraint
ALTER TABLE `frame_finalized` DROP FOREIGN KEY `fk_frame_design`;

-- Step 5: Remove the 'frameId' column now that 'designId' is populated and not nullable
ALTER TABLE `frame_finalized` DROP COLUMN `frameId`;

-- Step 6: Create an index for the new 'designId' column if necessary
CREATE INDEX `fk_frame_design` ON `frame_finalized`(`designId`);

-- Step 7: Add the new foreign key constraint on 'designId'
ALTER TABLE `frame_finalized` ADD CONSTRAINT `fk_frame_design` FOREIGN KEY (`designId`) REFERENCES `frame_designs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
