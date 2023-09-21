import { NetworkConfig } from "./types.d";

export default {
  spog: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
  chainId: 1,
  rpc: {
    default: "https://eth-mainnet.g.alchemy.com/v2/demo",
    values: [
      "https://eth-mainnet.g.alchemy.com/v2/demo",
      "https://eth.llamarpc.com",
      "https://eth.rpc.blxrbdn.com",
    ],
  },
} as NetworkConfig;
