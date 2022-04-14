export default function sleep(timeInMillis: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeInMillis);
  });
}
