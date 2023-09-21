import mainnet from "./mainnet.config";
import sepolia from "./sepolia.config";
import hardhat from "./hardhat.config";
export * from "./types.d";

const getNetworkConfig = () => {
  const { NODE_ENV, NETWORK } = process.env;

  console.log({ NODE_ENV, NETWORK });

  if (!NETWORK) {
    return NODE_ENV === "production" ? mainnet : hardhat;
  }

  if (NETWORK === "mainnet") return mainnet;
  if (NETWORK === "sepolia") return sepolia;
  if (NETWORK === "local" || NETWORK === "hardhat") return hardhat;
  else return hardhat;
};

export { mainnet, sepolia, hardhat, getNetworkConfig };
