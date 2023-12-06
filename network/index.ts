import mainnet from "./mainnet.config";
import sepolia from "./sepolia.config";
import hardhat from "./hardhat.config";
import { NetworkConfig } from "./types.d";
export * from "./types.d";

const networks = {
  mainnet,
  sepolia,
  hardhat,
};

const getNetworkConfig = (
  inputNetwork?: "mainnet" | "sepolia" | "hardhat" | number
) => {
  if (!inputNetwork) return findNetworkConfig();

  if (typeof inputNetwork === "number") {
    return Object.values(networks).find(
      (network) => network.rpc.chainId === inputNetwork
    )!;
  }

  return networks[inputNetwork] as NetworkConfig;
};

const findNetworkConfig = () => {
  const config = useRuntimeConfig();
  const { node, network } = config.public.env;

  // NETWORK env has higher priority
  if (network) {
    if (network === "mainnet") return mainnet;
    if (network === "sepolia") return sepolia;
    else return hardhat;
  }

  if (node === "development") return hardhat;

  return mainnet;
};

export { mainnet, sepolia, hardhat, getNetworkConfig };
