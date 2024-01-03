import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { useContractRead, useAccount } from "use-wagmi";
import { zeroTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();
  const store = useSpogStore();
  const spog = storeToRefs(store);

  const totalSupply = spog.tokens.value.zero!.totalSupply!.value;

  return useContractRead({
    address: spog.contracts.value.zeroToken as Hash,
    abi: zeroTokenABI,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    enabled: isConnected,
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
