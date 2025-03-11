import useBalanceCashToken from './useBalanceCashToken'
import useBalancePowerToken from './useBalancePowerToken'
import useBalanceZeroToken from './useBalanceZeroToken'

const useMBalances = (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  const cashToken = useBalanceCashToken(userAccount)
  const powerToken = useBalancePowerToken(userAccount)
  const zeroToken = useBalanceZeroToken(userAccount)

  return {
    cashToken,
    powerToken,
    zeroToken,
    refetch: () => {
      powerToken.refetch()
      zeroToken.refetch()
      cashToken.refetch()
    },
  }
}

export default useMBalances
