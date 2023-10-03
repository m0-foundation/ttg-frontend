import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    registrar: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    multicall3: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  },
  rpc: {
    chainId: 31337,
    default: "http://localhost:8545/",
    values: ["http://localhost:8545/", "http://localhost:8080/"],
  },
} as NetworkConfig;
