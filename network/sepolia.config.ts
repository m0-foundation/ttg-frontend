import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

const customRPC =
  "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II";
export default {
  contracts: {
    registrar: "0xdca9308059e575c70fe9168F4E55C13D84Eb34be",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 4575718,
  },
  rpc: {
    chainId: 11155111,
    default: customRPC,
    values: [customRPC, "https://rpc.notadegen.com/eth/sepolia"],
  },
} as NetworkConfig;
