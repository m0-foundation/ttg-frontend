import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useAccount, useContractRead } from "use-wagmi";
import { powerTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default () => {
  const { address, isConnected } = useAccount();

  const store = useSpogStore();
  const spog = storeToRefs(store);

  const token = spog.tokens.value.power;
  const totalSupply = spog.tokens.value.power!.totalSupply!.value;

  return useContractRead({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenABI,
    functionName: "getVotes",
    args: [address as Ref<Hash>],
    enabled: isConnected,
    watch: true,
    select: (data) => {
      const votingPower = BigInt(data as string);

      return {
        relative: Number((votingPower * 100n * 100n) / totalSupply) / 100,
        value: votingPower,
        formatted: formatUnits(votingPower, token?.decimals || 0),
      };
    },
  });
};
