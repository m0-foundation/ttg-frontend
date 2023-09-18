import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead } from "use-wagmi";
import { voteABI } from "@/lib/sdk";

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
    address: spog.contracts.value.vote as Hash,
    abi: voteABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => formatEther(data as bigint),
  });
};
