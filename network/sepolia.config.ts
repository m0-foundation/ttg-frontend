import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

const alchemy =
  "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II";

const infura = "https://sepolia.infura.io/v3/78c7c2ca91dc493c9c4389de0cf351c4";

export default {
  contracts: {
    registrar: "0xdca9308059e575c70fe9168F4E55C13D84Eb34be",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 4575718,
  },
  rpc: {
    chainId: 11155111,
    default: alchemy,
    values: [alchemy, infura],
  },
} as NetworkConfig;
