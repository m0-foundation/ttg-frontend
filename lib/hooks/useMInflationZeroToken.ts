import { useAccount, useReadContract } from "use-wagmi";
import { Hash, formatUnits } from "viem";
import get from "lodash/get";
import { powerTokenAbi, readZeroTokenPastTotalSupply } from "@/lib/sdk";

export default () => {
  // formula: maxTotalZeroRewardPerActiveEpoch * getPastVotes(account, lastEpoch) / pastTotalSupply(lastEpoch)

  const { address: account, isConnected } = useAccount();

  const ttg = useSpogStore();
  const currentEpoch = ttg.getEpoch.current.asNumber;
  const wagmiConfig = useWagmiConfig();

  const { maxTotalZeroRewardPerActiveEpoch } = ttg.governors.standard;
  const lastEpoch = BigInt(currentEpoch - 1);

  const getPastVotes = useReadContract({
    address: ttg.contracts.powerToken as Hash,
    abi: powerTokenAbi,
    functionName: "getPastVotes",
    args: [account as Ref<Hash>, lastEpoch],
    query: {
      enabled: isConnected,
    },
  });

  console.log({ getPastVotes });

  // wrap promise into ref
  const { state: pastTotalSupplyState } = useAsyncState(
    readZeroTokenPastTotalSupply(wagmiConfig, {
      address: ttg.contracts.powerToken! as Hash,
      args: [lastEpoch],
    }),
    null,
  );

  console.log({ pastTotalSupplyState });

  return computed(() => {
    //  return 0 to avoid division by zero
    if (!get(getPastVotes, "data.value", null)) return 0;
    if (!toValue(pastTotalSupplyState)) return 0;

    const pastVotes = BigInt(
      get(getPastVotes, "data.value") as unknown as bigint,
    );

    const pastTotalSupply = BigInt(
      toValue(pastTotalSupplyState) as unknown as bigint,
    );

    const zeroDecimalsMaxTotalZeroRewardPerActiveEpoch = BigInt(
      maxTotalZeroRewardPerActiveEpoch!,
    );
    const powerDecimalsPastVotes = BigInt(pastVotes);
    const powerDecimalsPastTotalSupply = BigInt(pastTotalSupply);

    // maxTotalZeroRewardPerActiveEpoch * getPastVotes(account, lastEpoch) / pastTotalSupply(lastEpoch)
    const zeroDecimalsProRataRewards =
      (zeroDecimalsMaxTotalZeroRewardPerActiveEpoch * powerDecimalsPastVotes) /
      powerDecimalsPastTotalSupply;

    return formatUnits(zeroDecimalsProRataRewards, ttg.tokens.zero.decimals!);
  });
};
