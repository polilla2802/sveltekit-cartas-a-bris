export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		console.error(`Invalid date: ${dateString}`);
		return dateString; // Return the original string if it's not a valid date
	}
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}