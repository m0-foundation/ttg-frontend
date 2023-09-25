import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    spog: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
    multicall3: sepolia.contracts.multicall3.address,
  },
  rpc: {
    chainId: 11155111,
    default: sepolia.rpcUrls.public.http[0],
    values: [
      sepolia.rpcUrls.public.http[0],
      "https://eth-sepolia.g.alchemy.com/v2/demo",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      "https://rpc2.sepolia.org",
    ],
  },
} as NetworkConfig;
