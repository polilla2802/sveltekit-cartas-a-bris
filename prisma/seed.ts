// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import frameTypesData from "../src/lib/seeders/frame_types.json" assert { type: "json" }
import frameDesignsData from "../src/lib/seeders/frame_designs.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
	console.log(`Start seeding ...`)

	for (const t of frameTypesData) {
		const frameType = await prisma.frame_types.create({
			data: {
				id: t.id,
				type: t.type
			}
		})
		console.log(`Created user with id: ${frameType.id}`)
	}

	for (const d of frameDesignsData) {
		const frameDesign = await prisma.frame_designs.create({
			data: {
				id: d.id,
				url: d.url,
				typeId: d.typeId,

			}
		})
		console.log(`Created frameDesign with id: ${frameDesign.id}`)
	}

	console.log(`Seeding finished.`)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})