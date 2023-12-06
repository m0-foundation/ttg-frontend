import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useContractRead } from "use-wagmi";
import { powerTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const store = useSpogStore();
  const spog = storeToRefs(store);
  // keep the reactive from the prop alive
  const account = ref(userAccount);

  return useContractRead({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenABI,
    functionName: "delegates",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => {
      return String(data);
    },
  });
};
