import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useReadContract } from "use-wagmi";
import { powerTokenAbi } from "../sdk";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  // keep the reactivity alive
  const address = ref(userAccount);

  const ttg = storeToRefs(useTtgStore());
  const token = ttg.tokens.value.power;
  const totalSupply = computed<bigint>(
    () => ttg.tokens.value.power.totalSupply?.value || 0n,
  );

  return useReadContract({
    address: ttg.contracts.value.powerToken as Hash,
    abi: powerTokenAbi,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    query: {
      select: (data) => {
        const votingPower = BigInt(data as unknown as bigint);

        return {
          relative:
            votingPower === 0n
              ? 0
              : (Number(votingPower) / Number(totalSupply.value)) * 100,
          value: votingPower,
          formatted: formatUnits(votingPower, token.decimals || 0),
          hasVotingPower: votingPower > 0n,
        };
      },
    },
  });
};
