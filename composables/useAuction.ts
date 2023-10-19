const ONE = 10_000n;
const START_BLOCK = 15_537_393n;
const EPOCH_PERIOD = 108_000n;
const AUCTION_PERIODS = 10n;
const SECONDS_PER_BLOCK = 12n;

// totalSupplyOfPreviousEpoch is the total supply of Power in the previous epoch
export const getAuctionPurchaseCost = (
  amount,
  blockNumber,
  totalSupplyOfPreviousEpoch
) => {
  const currentEpoch = getCurrentEpoch(blockNumber);

  const blocksRemaining = isVotingEpoch(currentEpoch)
    ? EPOCH_PERIOD
    : getBlocksRemainingInEpoch(blockNumber);

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

export const isVotingEpoch = (blockNumber: bigint) =>
  getCurrentEpoch(blockNumber) % 2n === 1n;

export const isTransferEpoch = (blockNumber: bigint) =>
  getCurrentEpoch(blockNumber) % 2n !== 1n;

const getBlocksRemainingInEpoch = (blockNumber) => {
  return (
    getBlockNumberOfEpochStart(getCurrentEpoch(blockNumber) + 1n) - blockNumber
  );
};

const getBlockNumberOfEpochStart = (epoch) =>
  START_BLOCK + epoch * EPOCH_PERIOD;

const totalSupplyAt = async (contract, epoch) =>
  contract.getTotalSupplyAt(epoch);

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

const toSeconds = (blocks) => blocks * SECONDS_PER_BLOCK;
