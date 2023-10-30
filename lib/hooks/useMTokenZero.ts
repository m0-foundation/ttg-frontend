import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useToken } from "use-wagmi";
import { useSpogStore } from "@/stores/spog";
import { useNetworkStore } from "@/stores/network";

export default () => {
  const spogStore = useSpogStore();
  const networkStore = useNetworkStore();
  const spog = storeToRefs(spogStore);
  const network = networkStore.getNetwork();

  return useToken({
    address: spog.contracts.value.zeroToken as Hash,
    chainId: network.value.rpc.chainId,
  });
};
