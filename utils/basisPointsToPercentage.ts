export default function (basisPoints: string | number): number {
  // convert from basispoints 0-10000 to 0-100 percentage range
  return Number(basisPoints) / 100
}
