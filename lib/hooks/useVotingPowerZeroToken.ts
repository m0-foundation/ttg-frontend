import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead } from "use-wagmi";
import useMTokenZero from "./useMTokenZero";
import { zeroTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const store = useSpogStore();
  const spog = storeToRefs(store);
  // keep the reactivity alive
  const account = ref(userAccount);

  const token = useMTokenZero();

  return useContractRead({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => {
      const votingPower = BigInt(data as string);
      const totalSupply = BigInt(
        (token?.data?.value?.totalSupply?.value as bigint) || 1n
      );

      return {
        relative: Number((votingPower * 100n) / totalSupply),
        value: votingPower,
        formatted: formatEther(votingPower),
      };
    },
  });
};
