import { useAccount, useReadContract } from "use-wagmi";
import { Hash, formatUnits } from "viem";
import get from "lodash/get";
import { readZeroTokenPastTotalSupply, zeroTokenAbi } from "@/lib/sdk";

export default () => {
  // formula: maxTotalZeroRewardPerActiveEpoch * getPastVotes(account, lastEpoch) / pastTotalSupply(lastEpoch)

  const { address: account, isConnected } = useAccount();

  const spog = useSpogStore();
  const currentEpoch = spog.getEpoch.current.asNumber;
  const wagmiConfig = useWagmiConfig();

  const { maxTotalZeroRewardPerActiveEpoch } = spog.governors.standard;
  const lastEpoch = BigInt(currentEpoch - 1);

  const getPastVotes = useReadContract({
    address: spog.contracts.zeroToken as Hash,
    abi: zeroTokenAbi,
    functionName: "getPastVotes",
    args: [account as Ref<Hash>, lastEpoch],
    query: {
      enabled: isConnected,
    },
  });

  // wrap promise into ref
  const { state: pastTotalSupplyState } = useAsyncState(
    readZeroTokenPastTotalSupply(wagmiConfig, {
      address: spog.contracts.zeroToken! as Hash,
      args: [lastEpoch],
    }),
    null
  );

  return computed(() => {
    //  return 0 to avoid division by zero
    if (!get(getPastVotes, "data.value", null)) return 0;
    if (!toValue(pastTotalSupplyState)) return 0;

    const pastVotes = BigInt(
      get(getPastVotes, "data.value") as unknown as bigint
    );

    const pastTotalSupply = BigInt(
      toValue(pastTotalSupplyState) as unknown as bigint
    );

    console.log({ pastVotes, pastTotalSupply });

    // safe division in bigint with 2 decimal places
    const inflatorRatio =
      Number((pastVotes * 10_000n) / pastTotalSupply) / 10_000;

    const inflatorBalance =
      Number(maxTotalZeroRewardPerActiveEpoch!) * inflatorRatio;

    return formatUnits(BigInt(inflatorBalance), spog.tokens.zero.decimals!);
  });
};
