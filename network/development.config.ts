import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK =
  import.meta.env.VITE_APP_RPC_URL_FALLBACK || sepolia.rpcUrls.default.http[0];

console.log("CONFIG VITE", import.meta.env.VITE_APP_RPC_URL_MAIN);

export default {
  network: "sepolia",
  contracts: {
    registrar: "0x398C33A182BaF6BCd1d38dE6F8CBF4202233A80e",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 5769606,
    zero: {
      allowedCashTokens: [
        "0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa", // WETH,
        "0x01236D80398d55580a9d599179d603ea128Bdf8c", // M token
      ],
    },
  },
  rpc: {
    chainId: 11155111,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;
