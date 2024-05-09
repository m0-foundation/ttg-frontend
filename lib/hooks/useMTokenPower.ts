import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useToken } from "use-wagmi";
import { useNetworkStore } from "@/stores/network";

export default () => {
  const ttgStore = useSpogStore();
  const networkStore = useNetworkStore();
  const ttg = storeToRefs(ttgStore);
  const network = networkStore.getNetwork();

  return useToken({
    address: ttg.contracts.value.powerToken as Hash,
    chainId: network.value.rpc.chainId,
    cacheTime: 0,
    staleTime: 1_000, // 1s
  });
};
