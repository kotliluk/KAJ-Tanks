/**
 * Modulo operation with positive result for negative numbers (as % in JavaScript can give negative results).
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Floors the given number to whole hundrets.
 */
export function floorToHundret(x: number): number {
  return Math.floor(x / 100) * 100;
}

/**
 * Computes euclidean distance of the given point [x, y] from origin [0, 0].
 */
export function euclideanOriginDistance(x: number, y: number): number {
  return Math.sqrt(x ** 2 + y ** 2);
}

/**
 * Computes euclidean distance of the given points [xA, yA] and [xB, yB].
 */
export function euclideanDistance(
  xA: number,
  yA: number,
  xB: number,
  yB: number
): number {
  return euclideanOriginDistance(xA - xB, yA - yB);
}
