import useVotingPowerZeroToken from "./useVotingPowerZeroToken";
import useVotingPowerPowerToken from "./useVotingPowerPowerToken";

export default () => {
  const powerTokenVotingPower = useVotingPowerPowerToken();

  const zeroTokenVotingPower = useVotingPowerZeroToken();

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
