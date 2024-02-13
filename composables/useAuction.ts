import { MEpoch } from "@/lib/api/modules/epoch/epoch.types";

const EPOCH_PERIOD = 1296000n;
const AUCTION_PERIODS = 100n;
const SECONDS_PER_BLOCK = 8n;

export const getAuctionPurchaseCost = (
  // Same func as "getCost" from PowerToken.sol, calculated in the frontend to save requests
  amount: bigint,
  epoch: MEpoch,
  totalSupplyOfPreviousEpoch: bigint
) => {
  const timeRemaining_ =
    epoch.current.type === "VOTING"
      ? EPOCH_PERIOD
      : BigInt(new Date().getTime() - epoch.current.asTimestamp);

  const secondsPerPeriod_ = EPOCH_PERIOD / AUCTION_PERIODS;
  const leftPoint_ = BigInt(2) ** (timeRemaining_ / secondsPerPeriod_);
  const remainder_ = timeRemaining_ % secondsPerPeriod_;

  // NOTE: A good amount of this can be done unchecked, but not every step, so it would look messy.
  return _divideUp(
    amount *
      (remainder_ * leftPoint_ +
        (secondsPerPeriod_ - remainder_) * (leftPoint_ / BigInt(2))),
    secondsPerPeriod_ * totalSupplyOfPreviousEpoch
  );

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

function _divideUp(x: bigint, y: bigint): bigint {
  if (y === BigInt(0)) throw new Error("DivisionByZero");

  let z = x * BigInt(1) + y;

  if (z < x) throw new Error("DivideUpOverflow");

  z = (z - BigInt(1)) / y;

  return z;
}
