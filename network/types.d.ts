export interface NetworkConfig {
  spog: string;
  chainId: number;
  multicall3?: string;
  rpc: {
    default: string;
    values: string[];
  }
}