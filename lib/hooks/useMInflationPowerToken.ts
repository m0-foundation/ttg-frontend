import { useAccount, useReadContract } from "use-wagmi";
import { Hash, formatUnits } from "viem";
import get from "lodash/get";
import { powerTokenAbi } from "@/lib/sdk";

export default () => {
  // formula: pastBalanceOf(account, lastEpoch) * participationInflation

  const { address: account, isConnected } = useAccount();

  const ttg = useTtgStore();

  const currentEpoch = ttg.getEpoch.current.asNumber;
  const lastEpoch = BigInt(currentEpoch - 1);

  const pastBalanceOf = useReadContract({
    address: ttg.contracts.powerToken as Hash,
    abi: powerTokenAbi,
    functionName: "pastBalanceOf",
    args: [account as Ref<Hash>, lastEpoch],
    query: {
      enabled: isConnected,
    },
  });

  // wrap promise into ref
  const { state: participationInflation } = useAsyncState(
    ttg.fetchPowerTokenValue([
      "participationInflation", // in basis points
    ]),
    null,
  );

  return computed(() => {
    //  return 0 to avoid division by zero
    if (!get(participationInflation, "value[0].result", null)) return 0;
    if (!get(pastBalanceOf, "data.value", null)) return 0;

    const inflatorRatio = BigInt(
      get(participationInflation, "value[0].result") as unknown as bigint,
    );
    const pastBalance = BigInt(
      get(pastBalanceOf, "data.value") as unknown as bigint,
    );

    const powerInflation = Math.floor(
      Number(pastBalance * inflatorRatio) / 10_000,
    );
    return formatUnits(BigInt(powerInflation), ttg.tokens.power.decimals!);
  });
};
