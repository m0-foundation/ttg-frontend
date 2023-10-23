import useMVotingPowerZeroToken from "./useMVotingPowerZeroToken";
import useMVotingPowerPowerToken from "./useMVotingPowerPowerToken";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const powerTokenVotingPower = useMVotingPowerPowerToken(userAccount);

  const zeroTokenVotingPower = useMVotingPowerZeroToken(userAccount);

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
