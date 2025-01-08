import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK =
  import.meta.env.VITE_APP_RPC_URL_FALLBACK || sepolia.rpcUrls.default.http[0];

export default {
  network: "sepolia",
  contracts: {
    registrar: "0x975Bf5f212367D09CB7f69D3dc4BA8C9B440aD3A",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 5783432,
    zero: {
      allowedCashTokens: [
        "0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa", // WETH,
        "0x0c941AD94Ca4A52EDAeAbF203b61bdd1807CeEC0", // M token
      ],
    },
    mToken: "0x0c941AD94Ca4A52EDAeAbF203b61bdd1807CeEC0",
    wrappedMToken: "0x3Ea1d88B298165A50ace6146A46Eb151bDDc22FD",
  },
  rpc: {
    chainId: 11155111,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;
