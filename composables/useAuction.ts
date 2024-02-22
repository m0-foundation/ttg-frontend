import { storeToRefs } from "pinia";
import { MEpoch } from "@/lib/api/modules/epoch/epoch.types";

const EPOCH_PERIOD = 1296000n;
const AUCTION_PERIODS = 100n;

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
};

export const getPricePoints = () => {
  const spog = useSpogStore();
  const { epoch } = storeToRefs(spog);

  const EPOCH_LENGTH =
    epoch.value.current.end.timestamp - epoch.value.current.asTimestamp;

  return Array.from(Array(Number(AUCTION_PERIODS + 1n)).keys()).map((_, i) => {
    const timeIntoEpoch = (BigInt(EPOCH_LENGTH) / AUCTION_PERIODS) * BigInt(i);

    return {
      x: epoch.value.current.asTimestamp + Number(timeIntoEpoch),
      y: 1n << (AUCTION_PERIODS - BigInt(i) - 1n),
    };
  });
};

function _divideUp(x: bigint, y: bigint): bigint {
  if (y === BigInt(0)) throw new Error("DivisionByZero");

  let z = x * BigInt(1) + y;

  if (z < x) throw new Error("DivideUpOverflow");

  z = (z - BigInt(1)) / y;

  return z;
}
