import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useReadContract, useAccount } from "use-wagmi";
import { zeroTokenAbi } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();
  const store = useSpogStore();
  const spog = storeToRefs(store);

  return useReadContract({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenAbi,
    functionName: "delegates",
    args: [address as Ref<Hash>],
    //     watch: true,
    query: {
      enabled: isConnected,
      select: (data) => {
        console.log("delegates", data);
        return String(data);
      },
    },
  });
};
