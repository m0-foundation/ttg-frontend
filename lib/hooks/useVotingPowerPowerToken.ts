import { storeToRefs } from "pinia";
import { Hash, formatUnits } from "viem";
import { useContractRead } from "use-wagmi";
import useMTokenPower from "./useMTokenPower";
import { powerTokenABI } from "@/lib/sdk";

const store = useSpogStore();
const spog = storeToRefs(store);

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  // keep the reactivity alive
  const account = ref(userAccount);

  const token = useMTokenPower();

  return useContractRead({
    address: spog.contracts.value.powerToken as Hash,
    abi: powerTokenABI,
    functionName: "getVotes",
    args: [account as Ref<Hash>],
    watch: true,
    select: (data) => {
      const votingPower = BigInt(data as string);
      const totalSupply = BigInt(
        token?.data?.value?.totalSupply.value as bigint
      );

      return {
        relative: Number((votingPower * 100n) / totalSupply),
        value: votingPower.toString(),
        formatted: formatUnits(votingPower, token?.data?.value?.decimals || 0),
      };
    },
  });
};
