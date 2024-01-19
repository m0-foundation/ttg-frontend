import { sepolia } from "@wagmi/core/chains";
import { NetworkConfig } from "./types.d";

const alchemy =
  "https://eth-sepolia.g.alchemy.com/v2/tKIhNojMKZzkva4HxAEuuoalYnUjMvAI";

const infura = "https://sepolia.infura.io/v3/78c7c2ca91dc493c9c4389de0cf351c4";

export default {
  contracts: {
    registrar: "0x83349dA424068b295C0C4a160f87C398e1612a01",
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 4868682,
  },
  rpc: {
    chainId: 11155111,
    default: alchemy,
    values: [alchemy, infura],
  },
} as NetworkConfig;
