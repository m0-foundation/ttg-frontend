import { Hash } from "viem";

export interface NetworkConfig {
  contracts: {
    registrar: Hash;
    multicall3: Hash;
  },
  rpc: {
    chainId: number;
    default: string;
    values: string[];
  }
}