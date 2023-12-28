import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useContractRead } from "use-wagmi";
import { powerTokenABI } from "@/lib/sdk";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const store = useSpogStore();
  const spog = storeToRefs(store);
  // keep the reactivity alive
  const account = ref(userAccount);

  const token = spog.tokens.value.power;
  const totalSupply = spog.tokens.value.power!.totalSupply!.value;

  return useContractRead({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
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
