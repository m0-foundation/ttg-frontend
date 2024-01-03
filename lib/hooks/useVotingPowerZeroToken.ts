import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead } from "use-wagmi";
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

  const totalSupply = spog.tokens.value.zero!.totalSupply!.value;

  return useContractRead({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenABI,
    functionName: "getVotes",
    args: [userAccount as Ref<Hash>],
    enabled: !!userAccount.value,
    watch: true,
    select: (data) => {
      const votingPower = BigInt(data as string);

      return {
        relative: Number((votingPower * 100n * 100n) / totalSupply) / 100,
        value: votingPower,
        formatted: formatEther(votingPower),
      };
    },
  });
};
