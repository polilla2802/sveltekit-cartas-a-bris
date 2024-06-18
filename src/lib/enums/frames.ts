export enum frameTypeEnum {
	romantic,
	galactic,
	funny,
	monochrome,
	vintage,
	modern,
	classic,
	nature,
	minimalist,
	abstract,
	beach,
	christmas,
	badbunny,
	sexy,
	flowers
}

export function getTypeEnumByTypeId(FrameTypeId: number) {
	switch (FrameTypeId) {
		case 1:
			return frameTypeEnum.romantic;
		case 2:
			return frameTypeEnum.galactic;
		case 3:
			return frameTypeEnum.funny;
		case 4:
			return frameTypeEnum.monochrome;
		case 5:
			return frameTypeEnum.vintage;
		case 6:
			return frameTypeEnum.modern;
		case 7:
			return frameTypeEnum.classic;
		case 8:
			return frameTypeEnum.nature;
		case 9:
			return frameTypeEnum.minimalist;
		case 10:
			return frameTypeEnum.abstract;
		case 11:
			return frameTypeEnum.beach;
		case 12:
			return frameTypeEnum.christmas;
		case 13:
			return frameTypeEnum.badbunny;
		case 14:
			return frameTypeEnum.sexy;
		case 15:
			return frameTypeEnum.flowers;
		default:
			return frameTypeEnum.badbunny;
	}
}

export function getFrameStringByTypeEnum(FrametypeEnum: frameTypeEnum) {
	switch (FrametypeEnum) {
		case frameTypeEnum.romantic:
			return "Romantic";
		case frameTypeEnum.galactic:
			return "Galactic";
		case frameTypeEnum.funny:
			return "Funny";
		case frameTypeEnum.monochrome:
			return "Monochrome";
		case frameTypeEnum.vintage:
			return "Vintage";
		case frameTypeEnum.modern:
			return "Modern";
		case frameTypeEnum.classic:
			return "Classic";
		case frameTypeEnum.nature:
			return "Nature";
		case frameTypeEnum.minimalist:
			return "Minimalist";
		case frameTypeEnum.abstract:
			return "Abstact"
		case frameTypeEnum.beach:
			return "Beach";
		case frameTypeEnum.christmas:
			return "Christmas";
		case frameTypeEnum.badbunny:
			return "Bad Bunny";
		case frameTypeEnum.sexy:
			return "Sexy";
		case frameTypeEnum.flowers:
			return "Flowers";
		default:
			return "Unknown";
	}
}