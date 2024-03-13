import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types";

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN;
const RPC_URL_FALLBACK = import.meta.env.VITE_APP_RPC_URL_FALLBACK;

console.log("CONFIG VITE", import.meta.env.VITE_APP_RPC_URL_MAIN);

export default {
  contracts: {
    registrar: "0x44031c4B2da545cac1200f53D895DA1BEa3064bC",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 5104663,
    zero: {
      allowedCashTokens: [
        "0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa", // WETH,
        "0x1f80158cc9305d69908e29e67c13e0774a3e60fb", // M token
      ],
    },
  },
  rpc: {
    chainId: 11155111,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig;
