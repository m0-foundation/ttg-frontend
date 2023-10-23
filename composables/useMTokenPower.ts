import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useToken } from "use-wagmi";

export default () => {
  const store = useSpogStore();
  const networkStore = useNetworkStore();
  const spog = storeToRefs(store);
  const network = networkStore.getNetwork();

  return useToken({
    address: spog.contracts.value.powerToken as Hash,
    chainId: network.value.rpc.chainId,
  });
};
