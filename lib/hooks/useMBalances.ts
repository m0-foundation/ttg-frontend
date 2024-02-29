import useBalancePowerToken from "./useBalancePowerToken";
import useBalanceZeroToken from "./useBalanceZeroToken";

const useMBalances = (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const powerToken = useBalancePowerToken(userAccount);
  const zeroToken = useBalanceZeroToken(userAccount);

  return {
    powerToken,
    zeroToken,
    refetch: () => {
      powerToken.refetch();
      zeroToken.refetch();
    },
  };
};

export default useMBalances;
