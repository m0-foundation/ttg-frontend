import { storeToRefs } from "pinia";
import { formatUnits } from "viem";
import useBalancePowerToken from "./useBalancePowerToken";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  // keep the reactivity alive
  const address = ref(userAccount);
  const spog = storeToRefs(useSpogStore());

  const { data: balance } = useBalancePowerToken(address);

  const token = spog.tokens.value.power;
  const totalSupply = computed(() => spog.tokens.value.power.totalSupply.value);
  const votingPower = computed(() => balance.value?.value || BigInt(0));

  return computed(() => ({
    relative:
      Number((votingPower.value * 100n * 100n) / totalSupply.value) / 100,
    value: votingPower.value,
    formatted: formatUnits(votingPower.value, token.decimals || 6),
    hasVotingPower: votingPower.value > 0n,
  }));
};
