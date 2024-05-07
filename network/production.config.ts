import { mainnet } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK =
  import.meta.env.VITE_APP_RPC_URL_FALLBACK || mainnet.rpcUrls.default.http[0];

export default {
  network: "mainnet",
  contracts: {
    registrar: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
    multicall3: mainnet.contracts.multicall3.address,
    deploymentBlock: 4520940,
  },
  rpc: {
    chainId: 1,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;
