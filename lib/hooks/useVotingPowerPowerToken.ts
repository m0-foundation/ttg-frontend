import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useAccount, useReadContract } from "use-wagmi";
import { powerTokenAbi } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();

  const store = useSpogStore();
  const spog = storeToRefs(store);

  const token = spog.tokens.value.power;
  const totalSupply = spog.tokens.value.power!.totalSupply!.value;

  return useReadContract({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenAbi,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    //     watch: true,
    query: {
      enabled: isConnected,
      select: (data) => {
        const votingPower = BigInt(data as string);

        return {
          relative: Number((votingPower * 100n * 100n) / totalSupply) / 100,
          value: votingPower,
          formatted: formatUnits(votingPower, token?.decimals || 0),
        };
      },
    },
  });
};
