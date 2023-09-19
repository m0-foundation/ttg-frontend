import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead } from "use-wagmi";
import useMTokenZero from "./useMTokenZero";
import { valueABI } from "@/lib/sdk";

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

  const token = useMTokenZero();

  return useContractRead({
    address: spog.contracts.value.value as Hash,
    abi: valueABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => {
      const votingPower = BigInt(data as string);
      const totalSupply = BigInt(
        token?.data?.value?.totalSupply.value as bigint
      );

      return {
        relative: Number((votingPower * 100n) / totalSupply) / 100,
        value: votingPower.toString(),
        formatted: formatEther(votingPower),
      };
    },
  });
};
