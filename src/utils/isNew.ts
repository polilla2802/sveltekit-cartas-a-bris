export function isNew(date: string): boolean {
  const frameDate = new Date(date);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

  // Check if the frame is less than or equal to one week old
  return currentDate.getTime() - frameDate.getTime() <= oneDay;
}
