import {
  Hash,
  bytesToHex,
  fromHex,
  pad,
  toHex,
  stringToBytes,
  trim,
} from "viem";

export function removeSelectorFromCallData(callData: Hash) {
  return bytesToHex(fromHex(callData, "bytes").slice(4));
}

export function addressToHexWith32Bytes(data: string) {
  return pad(data as Hash, {
    dir: "left",
    size: 32,
  });
}

export function hexWith32BytesToAddress(data: Hash) {
  return trim(data);
}

export function hexWith32BytesToString(hex: string): string {
  return fromHex(hex as Hash, { size: 32, to: "string" });
}

export function stringToHexWith32Bytes(data: string) {
  return toHex(stringToBytes(data, { size: 32 }));
}
