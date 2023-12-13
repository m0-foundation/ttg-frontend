import { PublicClient } from "viem";
import { EpochTypes, MEpoch } from "./epoch.types";

export const _STARTING_BLOCK =
  process.env.NODE_ENV === "development" ? 0 : 4847639;
export const _SECONDS_PER_BLOCK = 8;
export const _EPOCH_PERIOD = 50;

export class Epoch {
  client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async getBlockNumber(): Promise<bigint> {
    return await this.client.getBlock().then((block) => block.number);
  }

  async getEpochState(currentEpoch: number): Promise<MEpoch> {
    console.log({
      currentEpoch,
    });

    const currentEpochStartAsBlockNumber =
      this.getBlockNumberOfEpochStart(currentEpoch);

    const currentEpochStartAsBlock = await this.client.getBlock({
      blockNumber: BigInt(currentEpochStartAsBlockNumber),
    });

    console.log({
      currentEpochStartAsBlockNumber,
      currentEpochStartAsBlock,
    });

    const nextEpochAsBlockNumber = this.getBlockNumberOfEpochEnd(currentEpoch);

    const nextEpochAsTimestamp =
      Number(currentEpochStartAsBlock.timestamp) +
      _EPOCH_PERIOD * _SECONDS_PER_BLOCK;

    const getType = (epoch: number) =>
      epoch % 2 === 0 ? EpochTypes.TRANSFER : EpochTypes.VOTING;

    return {
      current: {
        asNumber: currentEpoch,
        asBlockNumber: currentEpochStartAsBlockNumber,
        asTimestamp: Number(currentEpochStartAsBlock.timestamp),
        type: getType(currentEpoch),
      },
      next: {
        asNumber: currentEpoch + 1,
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: nextEpochAsTimestamp,
        type: getType(currentEpoch + 1),
      },
    };
  }

  static getEpochFromBlock(blockNumber: bigint) {
    return (
      Math.floor((Number(blockNumber) - _STARTING_BLOCK) / _EPOCH_PERIOD) + 1
    );
  }

  getBlockNumberOfEpochStart(epoch: number) {
    return (epoch - 1) * _EPOCH_PERIOD + _STARTING_BLOCK;
  }

  getBlockNumberOfEpochEnd(epoch: number) {
    return this.getBlockNumberOfEpochStart(epoch + 1);
  }

  toSeconds(blockNumber: number) {
    return blockNumber * _SECONDS_PER_BLOCK;
  }

  async getTimestampFromEpoch(epoch: number) {
    const epochBlockNumber = epoch * _EPOCH_PERIOD;
    const currentBlockNumber = await this.getBlockNumber();

    const currentEpochAsBlock = await this.client.getBlock({
      blockNumber: BigInt(currentBlockNumber),
    });

    return (
      Number(currentEpochAsBlock.timestamp) +
      (this.toSeconds(epochBlockNumber) -
        this.toSeconds(Number(currentBlockNumber)))
    );
  }
}
