import { MEpoch } from "@/lib/api/modules/epoch/epoch.types";

const ONE_EPOCH = 400n;
const EPOCH_PERIOD = 108_000n;
const AUCTION_PERIODS = 100n;
const SECONDS_PER_BLOCK = 8n;

export const getAuctionPurchaseCost = (
  // Same func as "getCost" from PowerToken.sol, calculated in the frontend to save requests
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
    (ONE_EPOCH *
      amount *
      (remainder * leftPoint +
        (blocksPerPeriod - remainder) * (leftPoint >> 1n))) /
    (blocksPerPeriod * totalSupplyOfPreviousEpoch);

  return cost;
};

const getBlocksRemainingInEpoch = (epoch: MEpoch) => {
  return BigInt(epoch.next.asBlockNumber - epoch.current.asBlockNumber);
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
