import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useReadContract } from "use-wagmi";
import { zeroTokenAbi } from "../sdk";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  const address = ref(userAccount);
  const spog = storeToRefs(useSpogStore());

  const token = spog.tokens.value.zero;
  const totalSupply = computed(() => spog.tokens.value.zero.totalSupply.value);

  return useReadContract({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenAbi,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    query: {
      select: (data) => {
        const votingPower = BigInt(data as unknown as bigint);

        return {
          relative: getVotingPowerPercentageByTotalSupply(
            votingPower,
            totalSupply.value,
          ),
          value: votingPower,
          formatted: formatUnits(votingPower, token.decimals || 6),
          hasVotingPower: votingPower > 0n,
        };
      },
    },
  });
};
