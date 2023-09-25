import { Hash } from "viem";

export interface NetworkConfig {
  contracts: {
    spog: Hash;
    multicall3: Hash;
  },
  rpc: {
    chainId: number;
    default: string;
    values: string[];
  }
}