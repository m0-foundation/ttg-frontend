import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead } from "use-wagmi";
import { valueABI } from "@/lib/sdk";

const config = useRuntimeConfig();
const store = useSpogStore();
const spog = storeToRefs(store);

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  // keep the reactivity alive
  const account = ref(userAccount);

  return useContractRead({
    address: spog.contracts.value.value as Hash,
    abi: valueABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => formatEther(data as bigint),
  });
};
