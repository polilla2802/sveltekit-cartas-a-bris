-- CreateTable
CREATE TABLE "frame_designs" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "url" STRING(255),
    "typeId" INT8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" STRING(255),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INT8,

    CONSTRAINT "frame_designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frame_types" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "type" STRING(255),

    CONSTRAINT "frame_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frames_finalized" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "url" STRING(255) NOT NULL,
    "designId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" STRING(255),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INT8,

    CONSTRAINT "frame_finalized_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "userName" STRING(255) NOT NULL,
    "name" STRING(255) NOT NULL,
    "email" STRING(255) NOT NULL,
    "password" STRING(255) NOT NULL,
    "gender" STRING(50),
    "age" INT4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phoneNumber" STRING(20),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_frame_designs_type" ON "frame_designs"("typeId");

-- CreateIndex
CREATE INDEX "idx_frame_designs_user" ON "frame_designs"("userId");

-- CreateIndex
CREATE INDEX "idx_frame_finalized_design" ON "frames_finalized"("designId");

-- CreateIndex
CREATE INDEX "idx_frame_finalized_user" ON "frames_finalized"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "frame_designs" ADD CONSTRAINT "fk_frame_designs_type" FOREIGN KEY ("typeId") REFERENCES "frame_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "frame_designs" ADD CONSTRAINT "fk_frame_designs_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frames_finalized" ADD CONSTRAINT "fk_frame_finalized_design" FOREIGN KEY ("designId") REFERENCES "frame_designs"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "frames_finalized" ADD CONSTRAINT "fk_frame_finalized_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
