export function randomNumber(from: number, to: number): number {
  const n = Math.random() * (to - from) + from
  return parseInt(n.toString(), 10)
}
