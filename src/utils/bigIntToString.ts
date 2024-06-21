// Custom replacer to convert BigInt to Number
export const bigIntToString = (key: string, value: any) => {
	if (typeof value === 'bigint') {
		return value.toString(); // Convert BigInt to string
	}
	return value;
};