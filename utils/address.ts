import { Hash } from 'viem'

export const shortenAddress = (address: Hash | undefined | string) => {
  if (!address) return ''
  return `${address.slice(0, 7)}...${address.slice(38, 45)}`
}
