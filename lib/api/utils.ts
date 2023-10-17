import { Hash, bytesToHex, fromHex } from "viem";

export function removeSelectorFromCallData(callData: Hash) {
  return bytesToHex(fromHex(callData, "bytes").slice(4));
}

export function hexToBytes32String(hex: string): string {
  return fromHex(hex as Hash, { size: 32, to: "string" });
}
