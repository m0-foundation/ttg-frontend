import { useSwitchNetwork, useNetwork, Chain } from "use-wagmi";

export default () => {
  const network = useNetworkStore().getNetwork();
  const chainId = computed(() => network.value.rpc.chainId);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const isCorrectChain = computed(() => {
    return connectedChain?.value?.id === chainId.value;
  });

  function forceSwitchChain() {
    console.log({
      connectedChain: connectedChain?.value,
      chainId: chainId.value,
    });

    if (
      connectedChain &&
      connectedChain.value &&
      connectedChain.value.id !== chainId.value
    ) {
      return switchNetworkAsync(chainId.value);
    } else {
      return Promise.resolve(connectedChain?.value as Chain);
    }
  }

  return { forceSwitchChain, isCorrectChain };
};
