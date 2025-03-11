export default function (percentage: string): number {
  // convert from 0-100 percentage range to basispoints 0-10000
  return (Number(percentage) * 10000) / 100
}
