import useMBalancePowerToken from "./useMBalancePowerToken";
import useMBalanceZeroToken from "./useMBalanceZeroToken";

const useMBalances = (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const powerToken = useMBalancePowerToken(userAccount);
  const zeroToken = useMBalanceZeroToken(userAccount);

  return { powerToken, zeroToken };
};

export default useMBalances;
