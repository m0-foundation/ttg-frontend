import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    registrar: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    multicall3: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    deploymentBlock: 0,
  },
  rpc: {
    chainId: 31337,
    default: "http://localhost:8545/",
    values: ["http://localhost:8545/", "http://localhost:8080/"],
  },
} as NetworkConfig;
