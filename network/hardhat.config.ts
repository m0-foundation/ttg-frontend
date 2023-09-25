import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    spog: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
    multicall3: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
  },
  rpc: {
    chainId: 31337,
    default: "http://localhost:8545/",
    values: ["http://localhost:8545/", "http://localhost:8080/"],
  },
} as NetworkConfig;
