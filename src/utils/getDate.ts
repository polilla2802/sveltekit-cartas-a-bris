export function formatDate(dateString: string): string {
	const date = new Date(dateString);
    
	// Check if the parsed date is valid
	if (isNaN(date.getTime())) {
	    console.error(`Invalid date: ${dateString}`);
	    return dateString; // Return the original string if it's not a valid date
	}
    
	// Extract date components
	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // January is 0, so we add 1
	const year = date.getUTCFullYear();
    
	return `${day}-${month}-${year}`;
    }