import { useNetwork } from "use-wagmi";
import { Hash } from "viem";

export const useBlockExplorer = (type: string, hash: Hash) => {
  try {
    return new URL(
      `${type}/${hash}`,
      useNetwork()?.chain?.value?.blockExplorers?.default?.url
    );
  } catch (error) {
    console.log(error);
  }
};
