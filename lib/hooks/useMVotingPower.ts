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

  return { powerTokenVotingPower, zeroTokenVotingPower };
};
