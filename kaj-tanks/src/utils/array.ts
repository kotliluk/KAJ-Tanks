/**
 * Returns an array of given size with randomly chosen entries from the given array.
 * Rewritten to TypeScript from: https://stackoverflow.com/a/11935263
 */
export function getRandomSubarray<T>(arr: T[], size: number): T[] {
  let shuffled: T[] = arr.slice(0);
  let i = arr.length;
  let min = i - size;
  let temp: T;
  let index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
