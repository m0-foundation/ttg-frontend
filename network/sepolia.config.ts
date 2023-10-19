import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    registrar: "0x1EFeA064121f17379b267db17aCe135475514f8D",
    multicall3: sepolia.contracts.multicall3.address,
  },
  rpc: {
    chainId: 11155111,
    default:
      "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II",
    values: [
      sepolia.rpcUrls.public.http[0],
      "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II",
      "https://eth-sepolia.g.alchemy.com/v2/demo",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      "https://rpc2.sepolia.org",
    ],
  },
} as NetworkConfig;
