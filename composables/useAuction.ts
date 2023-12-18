import { MEpoch } from "@/lib/api/modules/epoch/epoch.types";

const ONE = 10_000n;
const START_BLOCK = 15_537_393n;
const EPOCH_PERIOD = 108_000n;
const AUCTION_PERIODS = 10n;
const SECONDS_PER_BLOCK = 12n;

// totalSupplyOfPreviousEpoch is the total supply of Power in the previous epoch
export const getAuctionPurchaseCost = (
  amount: bigint,
  epoch: MEpoch,
  totalSupplyOfPreviousEpoch: bigint
) => {
  const blocksRemaining =
    epoch.current.type === "VOTING"
      ? EPOCH_PERIOD
      : getBlocksRemainingInEpoch(epoch);

  const blocksPerPeriod = EPOCH_PERIOD / AUCTION_PERIODS;
  const leftPoint = 1n << (blocksRemaining / blocksPerPeriod);
  const remainder = blocksRemaining % blocksPerPeriod;

  const cost =
    (ONE *
      amount *
      (remainder * leftPoint +
        (blocksPerPeriod - remainder) * (leftPoint >> 1n))) /
    (blocksPerPeriod * totalSupplyOfPreviousEpoch);

  return cost;
};

export const getCurrentEpoch = (blockNumber: bigint) =>
  (blockNumber - START_BLOCK) / EPOCH_PERIOD;

const getBlocksRemainingInEpoch = (epoch: MEpoch) => {
  return BigInt(epoch.current.asNumber - epoch.next.asNumber);
};

export const getPricePoints = () => {
  const blocksPerPeriod = EPOCH_PERIOD / AUCTION_PERIODS;

  return Array.from(Array(Number(AUCTION_PERIODS + 1n)).keys()).map((_, i) => {
    const block = BigInt(i) * blocksPerPeriod;

    return {
      block,
      x: new Date().getTime() + Number(toSeconds(block)),
      y: Number(1n << (AUCTION_PERIODS - BigInt(i) - 1n)),
    };
  });
};

const toSeconds = (blocks: bigint) => blocks * SECONDS_PER_BLOCK;
