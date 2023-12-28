import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    registrar: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    multicall3: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    deploymentBlock: 0,
  },
  rpc: {
    chainId: 31337,
    default: "http://localhost:8545/",
    values: ["http://localhost:8545/"],
  },
} as NetworkConfig;
