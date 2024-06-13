// Convert the createdAt and updatedAt timestamps to EST
export function formatToEST(dateString: string): string {
  const date = new Date(dateString);
  const options = { timeZone: "America/New_York" };
  const dateInEST = new Intl.DateTimeFormat("en-US", options).format(date);
  const estDate = new Date(dateInEST);

  const day = estDate.getUTCDate().toString().padStart(2, "0");
  const month = (estDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = estDate.getUTCFullYear();

  return `${day}-${month}-${year}`;
}
