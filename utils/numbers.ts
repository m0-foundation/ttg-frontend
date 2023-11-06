export function basisPointsToDecimal(basisPoints: string): number {
  // convert from basispoints 0-10000 to 0-1 percentage range decimal
  return Number(basisPoints) / 10000;
}
