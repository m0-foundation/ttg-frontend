import { GovernorModule } from "../GovernorModule";
import { MEpoch } from "./epoch.types";

// Ethereum finalized 'The Merge' at block 15_537_393 on September 15, 2022, at 05:42:42 GMT.
export const _START_BLOCK = 15_537_393;
export const _SECONDS_PER_BLOCK = 12;
export const _EPOCH_PERIOD = 108_000; // Defines 15 days worth of blocks (108,000)

export class Epoch extends GovernorModule {
  async getBlockNumber(): Promise<bigint> {
    return await this.client.getBlock().then((block) => block.number);
  }

  async getEpochState(): Promise<MEpoch> {
    // const currentEpoch = await readDualGovernor({
    //   address: this.contract,
    //   functionName: "clock",
    // });

    const currentBlock = await this.client.getBlock();
    const currentEpoch = await this.currentEpoch(currentBlock.number);

    const currentEpochAsBlockNumber =
      this.getBlockNumberOfEpochStart(currentEpoch);

    console.log({ currentBlock, currentEpochAsBlockNumber });

    const nextEpochAsBlockNumber = this.getBlockNumberOfEpochEnd(currentEpoch);

    const currentEpochAsBlock = await this.client.getBlock({
      blockNumber: BigInt(currentEpochAsBlockNumber),
    });

    const nextEpochAsTimestamp =
      Number(currentEpochAsBlock.timestamp) +
      _EPOCH_PERIOD * _SECONDS_PER_BLOCK;

    return {
      current: {
        asNumber: currentEpoch,
        asBlockNumber: currentEpochAsBlockNumber,
        asTimestamp: Number(currentEpochAsBlock.timestamp),
      },
      next: {
        asNumber: currentEpoch + 1,
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: nextEpochAsTimestamp,
      },
    };
  }

  async currentEpoch(_blockNumber?: bigint) {
    let blockNumber = _blockNumber;
    if (!blockNumber) {
      blockNumber = await this.getBlockNumber();
    }

    return Math.floor((Number(blockNumber) - _START_BLOCK) / _EPOCH_PERIOD);
  }

  static getEpochFromBlock(blockNumber: number) {
    return Math.floor((Number(blockNumber) - _START_BLOCK) / _EPOCH_PERIOD);
  }

  toSeconds(blocks_: number) {
    return blocks_ * _SECONDS_PER_BLOCK;
  }

  getBlockNumberOfEpochStart(epoch: number) {
    return _START_BLOCK + epoch * _EPOCH_PERIOD;
  }

  async startBlockOfCurrentEpoch() {
    const epoch = await this.currentEpoch();
    return this.getBlockNumberOfEpochStart(epoch);
  }

  async endBlockOfCurrentEpoch() {
    const epoch = await this.currentEpoch();
    return this.getBlockNumberOfEpochStart(epoch + 1);
  }

  async blocksElapsedInCurrentEpoch() {
    const blockNumber = await this.getBlockNumber();
    const startBlock = await this.startBlockOfCurrentEpoch();
    return Number(blockNumber) - startBlock;
  }

  async timeElapsedInCurrentEpoch() {
    const blocks = await this.blocksElapsedInCurrentEpoch();
    return this.toSeconds(blocks);
  }

  async blocksRemainingInCurrentEpoch() {
    const blockNumber = await this.getBlockNumber();
    const endBlock = await this.endBlockOfCurrentEpoch();
    return endBlock - Number(blockNumber);
  }

  async timeRemainingInCurrentEpoch() {
    const blocks = await this.blocksRemainingInCurrentEpoch();
    return this.toSeconds(blocks);
  }

  async getBlocksUntilEpochStart(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    return this.getBlockNumberOfEpochStart(epoch) - Number(blockNumber);
  }

  async getSecondsUntilEpochStart(epoch: number) {
    const blocks = await this.getBlocksUntilEpochStart(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksUntilEpochEnds(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    const blockStart = this.getBlockNumberOfEpochStart(epoch + 1);
    return blockStart - Number(blockNumber);
  }

  async getSecondsUntilEpochEnds(epoch: number) {
    const blocks = await this.getBlocksUntilEpochEnds(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksSinceEpochStart(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    return Number(blockNumber) - this.getBlockNumberOfEpochStart(epoch);
  }

  async getSecondsSinceEpochStart(epoch: number) {
    const blocks = await this.getBlocksSinceEpochStart(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksSinceEpochEnd(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    return Number(blockNumber) - this.getBlockNumberOfEpochStart(epoch + 1);
  }

  async getSecondsSinceEpochEnd(epoch: number) {
    const blocks = await this.getBlocksSinceEpochEnd(epoch);
    return this.toSeconds(blocks);
  }

  getBlockNumberOfEpochEnd(epoch: number) {
    return this.getBlockNumberOfEpochStart(epoch + 1);
  }
}
