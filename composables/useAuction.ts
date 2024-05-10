import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { readPowerToken } from "@/lib/sdk";

const AUCTION_PERIODS = 100n;

const amountLeftToAuction = ref<bigint>(0n);
const currentCost = ref({
  value: 0n,
  timestamp: 0,
});

export const useAuction = () => {
  const ttg = useTtgStore();
  const { epoch } = storeToRefs(ttg);
  const wagmiConfig = useWagmiConfig();
  const isTransferEpoch = computed(
    () => ttg.epoch.current?.type === "TRANSFER",
  );

  const getPricePoints = () => {
    const EPOCH_LENGTH =
      epoch.value.current.end.timestamp - epoch.value.current.asTimestamp;

    // We create an array of 101 points, each representing the price of a POWER token at a specific time in the current epoch
    // The x value is the timestamp of the point, and the y value is the price of a POWER token at that time

    return Array.from(Array(Number(AUCTION_PERIODS + 1n)).keys()).map(
      (_, i) => {
        const timeIntoEpoch =
          (BigInt(EPOCH_LENGTH) / AUCTION_PERIODS) * BigInt(i);

        return {
          x: epoch.value.current.asTimestamp + Number(timeIntoEpoch),
          y: calculateExponentialIncrease(i, AUCTION_PERIODS),
        };
      },
    );
  };

  const getCurrentCost = async () => {
    if (!isTransferEpoch.value) return 0n;
    try {
      const purchaseCost = await readPowerToken(wagmiConfig, {
        address: ttg.contracts.powerToken as Hash,
        functionName: "getCost",
        args: [1n], // We send 1n as the amount to get the current cost of 1 POWER token
      });

      if (purchaseCost === currentCost.value.value) return;

      currentCost.value = {
        value: purchaseCost || 0n,
        timestamp: Math.floor(new Date().getTime() / 1000),
      };
    } catch (error) {
      console.log(error);
    }
  };

  async function getAmountLeftToAuction() {
    try {
      amountLeftToAuction.value = await readPowerToken(wagmiConfig, {
        address: ttg!.contracts!.powerToken! as Hash,
        functionName: "amountToAuction",
      });
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(() => {
    getCurrentCost();
    getAmountLeftToAuction();
  });

  setInterval(() => {
    if (!isTransferEpoch.value) return;
    getCurrentCost();
  }, 5000);

  watch(isTransferEpoch, () => {
    getCurrentCost();
    getAmountLeftToAuction();
  });

  return {
    amountLeftToAuction,
    currentCost,
    getPricePoints,
    getCurrentCost,
    getAmountLeftToAuction,
  };
};

function calculateExponentialIncrease(
  index: number,
  totalPeriods: bigint,
): bigint {
  // This function calculates the exponential increase for a given index and total number of periods.
  return 1n << (totalPeriods - BigInt(index) - 1n);
}
