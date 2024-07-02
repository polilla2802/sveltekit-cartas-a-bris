export function parseBoolean(value: any): boolean | undefined {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'string') {
		const lowerCaseValue = value.toLowerCase();
		if (lowerCaseValue === 'true') {
			return true;
		} else if (lowerCaseValue === 'false') {
			return false;
		}
	}
	// Handle other cases or return undefined if value cannot be parsed
	return undefined;
}