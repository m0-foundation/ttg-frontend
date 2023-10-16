import { mainnet } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

export default {
  contracts: {
    registrar: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
    multicall3: mainnet.contracts.multicall3.address,
  },
  rpc: {
    chainId: 1,
    default: mainnet.rpcUrls.public.http[0],
    values: [
      mainnet.rpcUrls.public.http[0],
      "https://eth-mainnet.g.alchemy.com/v2/demo",
      "https://eth.llamarpc.com",
      "https://eth.rpc.blxrbdn.com",
    ],
  },
} as NetworkConfig;
