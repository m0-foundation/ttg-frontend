import useMPastVotingPowerZeroToken from "./useMPastVotingPowerZeroToken";
import useMPastVotingPowerPowerToken from "./useMPastVotingPowerPowerToken";

export default ({
  epoch,
  userAccount,
}: {
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>;
  epoch: globalThis.Ref<bigint>;
}) => {
  const power = useMPastVotingPowerPowerToken({ userAccount, epoch });
  const zero = useMPastVotingPowerZeroToken({ userAccount, epoch });

  return {
    power,
    zero,
    refetch: () => {
      power.refetch();
      zero.refetch();
    },
  };
};
