export function formatToEST(dateString: string): string {
  const date = new Date(dateString);
  
  // Subtract one hour
  date.setHours(date.getHours() - 1);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const dateInEST = new Intl.DateTimeFormat("en-US", options).format(date);
  
  // Split the dateInEST into components
  const [month, day, year, hour, minute] = dateInEST.match(/\d+/g)!;

  return `${day}-${month}-${year} ${hour}:${minute}`;

  // return `${day}-${month}-${year}`;

}
