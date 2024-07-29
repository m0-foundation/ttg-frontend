import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useReadContracts } from "use-wagmi";
import { powerTokenAbi } from "../sdk";
import { useTtgStore } from "@/stores/ttg";

export default ({
  epoch,
  userAccount,
}: {
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>;
  epoch: globalThis.Ref<bigint>;
}) => {
  // keep the reactivity alive
  const address = ref(userAccount);

  const ttg = storeToRefs(useTtgStore());
  const token = ttg.tokens.value.power;

  return useReadContracts({
    contracts: [
      {
        address: token.address as Hash,
        abi: powerTokenAbi,
        functionName: "getPastVotes",
        args: [address as Ref<Hash>, epoch],
      },
      {
        address: token.address as Hash,
        abi: powerTokenAbi,
        functionName: "pastTotalSupply",
        args: [epoch],
      },
    ],
    query: {
      // @ts-ignore comment
      select: (data: { result: any }[]) => {
        const [{ result: getPastVotes }, { result: pastTotalSupply }] = data;
        const votingPower = BigInt(getPastVotes as unknown as bigint);
        const totalSupply = BigInt(pastTotalSupply as unknown as bigint);
        console.log({ votingPower, totalSupply });
        return {
          relative:
            votingPower === 0n
              ? 0
              : Number((votingPower * 100n * 100n) / totalSupply) / 100,
          value: votingPower,
          formatted: formatUnits(votingPower, token.decimals || 0),
          hasVotingPower: votingPower > 0n,
        };
      },
    },
  });
};
