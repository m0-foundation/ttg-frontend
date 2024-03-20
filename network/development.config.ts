import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK = import.meta.env.VITE_APP_RPC_URL_FALLBACK || sepolia.rpcUrls.default.http[0];

console.log("CONFIG VITE", import.meta.env.VITE_APP_RPC_URL_MAIN);

export default {
  network: "sepolia",
  contracts: {
    registrar: "0x7A05438036B30Fa040884b03275e9D7cEdFE4624",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 5508124,
    zero: {
      allowedCashTokens: [
        "0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa", // WETH,
        "0xc16a22574689F394A5406b9a3Dd826b80bE0E133", // M token
      ],
    },
  },
  rpc: {
    chainId: 11155111,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;