import { mainnet } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK =
  import.meta.env.VITE_APP_RPC_URL_FALLBACK || mainnet.rpcUrls.default.http[0];

export default {
  network: "mainnet",
  contracts: {
    registrar: "0x119FbeeDD4F4f4298Fb59B720d5654442b81ae2c",
    multicall3: mainnet.contracts.multicall3.address,
    deploymentBlock: 19812904,
    zero: {
      allowedCashTokens: [
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH,
        "0x866A2BF4E572CbcF37D5071A7a58503Bfb36be1b", // M token
      ],
    },
    mToken: "0x866A2BF4E572CbcF37D5071A7a58503Bfb36be1b",
    wrappedMToken: "0x437cc33344a0B27A429f795ff6B469C72698B291",
  },
  rpc: {
    chainId: 1,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;
