import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useToken } from "use-wagmi";

export default () => {
  const store = useSpogStore();
  const spog = storeToRefs(store);
  const network = useNetworkStore().getNetwork();

  return useToken({
    address: spog.contracts.value.zeroToken as Hash,
    chainId: network.value.rpc.chainId,
  });
};