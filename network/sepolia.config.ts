import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

const customRPC =
  "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II";
export default {
  contracts: {
    registrar: "0x1EFeA064121f17379b267db17aCe135475514f8D",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 4520940,
  },
  rpc: {
    chainId: 11155111,
    default: customRPC,
    values: [customRPC, "https://rpc.notadegen.com/eth/sepolia"],
  },
} as NetworkConfig;
