import { NetworkConfig } from "./types.d";

export default {
  spog: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
  chainId: 11155111,
  rpc: {
    default: "https://eth-sepolia.g.alchemy.com/v2/demo",
    values: [
      "https://eth-sepolia.g.alchemy.com/v2/demo",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      "https://rpc2.sepolia.org",
    ],
  },
} as NetworkConfig;
