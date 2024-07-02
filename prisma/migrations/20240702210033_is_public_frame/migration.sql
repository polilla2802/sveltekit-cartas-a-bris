-- AlterTable
ALTER TABLE "frame_designs" ADD COLUMN     "isPublic" BOOL DEFAULT false;

-- AlterTable
ALTER TABLE "frames_finalized" ADD COLUMN     "isPublic" BOOL DEFAULT false;
