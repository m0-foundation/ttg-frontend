import useVotingPowerZeroToken from "./useVotingPowerZeroToken";
import useVotingPowerPowerToken from "./useVotingPowerPowerToken";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const powerTokenVotingPower = useVotingPowerPowerToken(userAccount);

  const zeroTokenVotingPower = useVotingPowerZeroToken(userAccount);

  const hasPowerTokensVotingPower = computed(() =>
    powerTokenVotingPower?.data?.value?.value
      ? powerTokenVotingPower?.data?.value.value > 0n
      : false
  );

  const hasZeroTokenVotingPower = computed(() =>
    powerTokenVotingPower?.data?.value?.value
      ? powerTokenVotingPower?.data?.value.value > 0n
      : false
  );

  return {
    powerTokenVotingPower,
    zeroTokenVotingPower,
    hasPowerTokensVotingPower,
    hasZeroTokenVotingPower,
  };
};
