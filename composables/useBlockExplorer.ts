import { useNetwork } from "use-wagmi";
import { Hash } from "viem";

export const useBlockExplorer = (type: string, hash: Hash | string) => {
  const network = useNetworkStore().getNetwork();
  const { chains } = useNetwork();

  const currentNetwork = computed(() => {
    return chains.value.find((chain) => chain.id === network.value.rpc.chainId);
  });

  const explorerUrl = currentNetwork?.value?.blockExplorers?.default?.url;

  if (explorerUrl) {
    return new URL(`${type}/${hash}`, explorerUrl).toString();
  }
};
