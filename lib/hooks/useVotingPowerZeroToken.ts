import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useReadContract } from "use-wagmi";
import { zeroTokenAbi } from "../sdk";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  const address = ref(userAccount);
  const ttg = storeToRefs(useTtgStore());

  const token = ttg.tokens.value.zero;
  const totalSupply = computed(() => ttg.tokens.value.zero.totalSupply.value);

  return useReadContract({
    address: ttg.contracts.value.zeroToken as Hash,
    abi: zeroTokenAbi,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    query: {
      select: (data) => {
        const votingPower = BigInt(data as unknown as bigint);

        return {
          relative:
            votingPower === 0n
              ? 0
              : Number((votingPower * 100n * 100n) / totalSupply.value) / 100,
          value: votingPower,
          formatted: formatUnits(votingPower, token.decimals || 6),
          hasVotingPower: votingPower > 0n,
        };
      },
    },
  });
};
