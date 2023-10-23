import { storeToRefs } from "pinia";
import type { Hash } from "viem";
import { useContractRead } from "use-wagmi";
import { useSpogStore } from "@/stores/spog";
import { zeroTokenABI } from "@/lib/sdk";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const spogStore = useSpogStore();
  const spog = storeToRefs(spogStore);

  console.log("before zero", { spog, userAccount });
  // keep the reactive from the prop alive
  const account = ref(userAccount);

  return useContractRead({
    address: spog?.contracts?.value?.zeroToken as Hash,
    abi: zeroTokenABI,
    functionName: "delegates",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => {
      console.log("delegates", data);
      return String(data);
    },
  });
};
