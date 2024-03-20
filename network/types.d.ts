import { Hash } from "viem";

export interface NetworkConfig {
  network: "sepolia" | "mainnet" | "hardhat",
  contracts: {
    registrar: Hash;
    multicall3: Hash;
    deploymentBlock: number,
    zero?: {
      allowedCashTokens?: Hash[];
    }
  },
  rpc: {
    chainId: number;
    default?: string;
    values?: string[];
  }
}