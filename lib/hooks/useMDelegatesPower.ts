import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useContractRead, useAccount } from "use-wagmi";
import { powerTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();

  const store = useSpogStore();
  const spog = storeToRefs(store);

  return useContractRead({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenABI,
    functionName: "delegates",
    args: [address as Ref<Hash>],
    enabled: isConnected,
    watch: true,
    select: (data) => {
      console.log("delegates", data);
      return String(data);
    },
  });
};
