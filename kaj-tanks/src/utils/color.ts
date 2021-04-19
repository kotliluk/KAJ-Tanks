const rgbRangeDecimal: number = 16777216;

/**
 * Generates random RGB color string "#......".
 */
export function randomRGB(): string {
  return (
    "#" +
    Math.floor(Math.random() * rgbRangeDecimal)
      .toString(16)
      .padStart(6, "0")
  );
}
