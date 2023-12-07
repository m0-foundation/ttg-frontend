import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

const alchemy =
  "https://eth-sepolia.g.alchemy.com/v2/B60--jGVtrkIkYtB_uJ81RoNf4qfk3II";

const infura = "https://sepolia.infura.io/v3/78c7c2ca91dc493c9c4389de0cf351c4";

export default {
  contracts: {
    registrar: "0xa50EFdF879e19d1685157Ad596B31f7840E84840",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 4842153,
  },
  rpc: {
    chainId: 11155111,
    default: alchemy,
    values: [alchemy, infura],
  },
} as NetworkConfig;
