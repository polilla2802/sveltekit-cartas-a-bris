/*
  Warnings:

  - You are about to drop the `frame_finalized` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[firebaseUid]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUid` to the `user` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add a temporary column with a default value to populate existing rows
ALTER TABLE "user" ADD COLUMN "firebaseUid_temp" STRING(255) DEFAULT 'default-uid';

-- Step 2: Update existing rows to ensure the new column has a value
UPDATE "user" SET "firebaseUid_temp" = CONCAT('uid-', id::text) WHERE "firebaseUid_temp" IS NULL;

-- Step 3: Remove the old firebaseUid column (if it was already added in an earlier migration attempt and failed)
-- DROP COLUMN will fail if the column does not exist, so this is conditional based on your migration history.
ALTER TABLE "user" DROP COLUMN IF EXISTS "firebaseUid";

-- Step 4: Rename the temporary column to the intended column name
ALTER TABLE "user" RENAME COLUMN "firebaseUid_temp" TO "firebaseUid";

-- Step 5: Ensure the renamed column does not allow NULLs
ALTER TABLE "user" ALTER COLUMN "firebaseUid" SET NOT NULL;

-- Step 6: Add the unique constraint on the firebaseUid column
CREATE UNIQUE INDEX "user_firebaseUid_key" ON "user"("firebaseUid");

-- Step 7: Drop the foreign keys associated with the `frame_finalized` table
ALTER TABLE "frame_finalized" DROP CONSTRAINT "fk_frame_finalized_design";
ALTER TABLE "frame_finalized" DROP CONSTRAINT "fk_frame_finalized_user";

-- Step 8: Drop the old `frame_finalized` table
DROP TABLE "frame_finalized";

-- Step 9: Create the new `frames_finalized` table
CREATE TABLE "frames_finalized" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "url" STRING(255) NOT NULL,
    "designId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" STRING(255),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INT8,
    "forUserId" INT8,

    CONSTRAINT "frames_finalized_pkey" PRIMARY KEY ("id")
);

-- Step 10: Create indices for the new table
CREATE INDEX "idx_frames_finalized_design" ON "frames_finalized"("designId");
CREATE INDEX "idx_frames_finalized_user" ON "frames_finalized"("userId");
CREATE INDEX "idx_frames_finalized_for_user" ON "frames_finalized"("forUserId");

-- Step 11: Add foreign keys to the new table
ALTER TABLE "frames_finalized" ADD CONSTRAINT "fk_frames_finalized_design" FOREIGN KEY ("designId") REFERENCES "frame_designs"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "frames_finalized" ADD CONSTRAINT "fk_frames_finalized_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "frames_finalized" ADD CONSTRAINT "fk_frames_finalized_for_user" FOREIGN KEY ("forUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
