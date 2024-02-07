import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useReadContract, useAccount } from "use-wagmi";
import { powerTokenAbi } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();

  const store = useSpogStore();
  const spog = storeToRefs(store);

  return useReadContract({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenAbi,
    functionName: "delegates",
    args: [address as Ref<Hash>],
    // watch: true,
    query: {
      watch: true,
      enabled: isConnected,
      select: (data) => {
        console.log("delegates", data);
        return String(data);
      },
    },
  });
};
