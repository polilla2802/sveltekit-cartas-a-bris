let previousNumber: number = 0;

export function getRandomNumber(min: number, max: number): number {
  let randomNumber: number;
  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (randomNumber === previousNumber);

  previousNumber = randomNumber;
  return randomNumber;
}
