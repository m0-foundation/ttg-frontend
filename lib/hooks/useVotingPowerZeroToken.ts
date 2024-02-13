import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useReadContract, useAccount } from "use-wagmi";
import { zeroTokenAbi } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();
  const store = useSpogStore();
  const spog = storeToRefs(store);

  const totalSupply = spog.tokens.value.zero!.totalSupply!.value;

  return useReadContract({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenAbi,
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
          formatted: formatEther(votingPower),
        };
      },
    },
  });
};
