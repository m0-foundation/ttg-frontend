import { storeToRefs } from "pinia";
import { formatUnits } from "viem";
import useBalanceZeroToken from "./useBalanceZeroToken";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const address = ref(userAccount);
  const spog = storeToRefs(useSpogStore());

  const { data: balance } = useBalanceZeroToken(address);

  const token = spog.tokens.value.zero;
  const totalSupply = computed(() => spog.tokens.value.zero.totalSupply.value);
  const votingPower = computed(() => balance.value?.value || BigInt(0));

  return computed(() => ({
    relative:
      Number((votingPower.value * 100n * 100n) / totalSupply.value) / 100,
    value: votingPower.value,
    formatted: formatUnits(votingPower.value, token.decimals || 0),
    hasVotingPower: votingPower.value > 0n,
  }));
};
