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
  const spog = useSpogStore();
  const { epoch } = storeToRefs(spog);
  const wagmiConfig = useWagmiConfig();
  const isTransferEpoch = computed(
    () => spog.epoch.current?.type === "TRANSFER"
  );

  const getPricePoints = () => {
    const EPOCH_LENGTH =
      epoch.value.current.end.timestamp - epoch.value.current.asTimestamp;

    return Array.from(Array(Number(AUCTION_PERIODS + 1n)).keys()).map(
      (_, i) => {
        const timeIntoEpoch =
          (BigInt(EPOCH_LENGTH) / AUCTION_PERIODS) * BigInt(i);

        return {
          x: epoch.value.current.asTimestamp + Number(timeIntoEpoch),
          y: 1n << (AUCTION_PERIODS - BigInt(i) - 1n),
        };
      }
    );
  };

  const getCurrentCost = async () => {
    if (!isTransferEpoch.value) return 0n;
    try {
      const purchaseCost = await readPowerToken(wagmiConfig, {
        address: spog.contracts.powerToken as Hash,
        functionName: "getCost",
        args: [1n],
      });

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
        address: spog!.contracts!.powerToken! as Hash,
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
    getCurrentCost();
  }, 3000);

  return {
    amountLeftToAuction,
    currentCost,
    getPricePoints,
    getCurrentCost,
    getAmountLeftToAuction,
  };
};
