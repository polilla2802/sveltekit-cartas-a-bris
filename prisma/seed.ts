// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import frameTypesData from "../src/lib/seeders/frame_types.json" assert { type: "json" };
import frameDesignsData from "../src/lib/seeders/frame_designs.json" assert { type: "json" };
import frameFinalizedData from "../src/lib/seeders/frames_finalized.json" assert { type: "json" };
import userData from "../src/lib/seeders/users.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        id: u.id,
        firebaseUid: u.firebaseUuid,
        userName: u.userName,
        name: u.name,
        phoneNumber: u.phoneNumber,
        email: u.email,
        gender: u.gender,
        age: u.age,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const t of frameTypesData) {
    const frameType = await prisma.frame_types.create({
      data: {
        id: t.id,
        type: t.type,
      },
    });
    console.log(`Created frameType with id: ${frameType.id}`);
  }

  for (const d of frameDesignsData) {
    const frameDesign = await prisma.frame_designs.create({
      data: {
        id: d.id,
        name: d.name,
        url: d.url,
        typeId: d.typeId,
        createdBy: d.createdBy,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      },
    });
    console.log(`Created frameDesign with id: ${frameDesign.id}`);
  }

  for (const f of frameFinalizedData) {
    const framesFinalized = await prisma.frames_finalized.create({
      data: {
        id: f.id,
        name: f.name,
        url: f.url,
        designId: f.designId,
        createdBy: f.createdBy,
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt),
      },
    });
    console.log(`Created framesFinalized with id: ${framesFinalized.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
