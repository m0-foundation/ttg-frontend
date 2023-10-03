import { GovernorModule } from "../GovernorModule";
import { MEpoch } from "./epoch.types";

// Ethereum finalized 'The Merge' at block 15_537_393 on September 15, 2022, at 05:42:42 GMT.
const _START_BLOCK = 15_537_393;
const _SECONDS_PER_BLOCK = 12;
const _EPOCH_PERIOD = 108_000; // Defines 15 days worth of blocks (108,000)

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
    console.log({ currentBlock });
    const currentEpoch = await this.currentEpoch(currentBlock.number);
    console.log({ currentEpoch });

    const currentEpochAsBlockNumber =
      this.getBlockNumberOfEpochStart(currentEpoch);
    console.log({ currentEpochAsBlockNumber });
    const nextEpochAsBlockNumber = this.getBlockNumberOfEpochEnd(currentEpoch);
    console.log({ nextEpochAsBlockNumber });

    return {
      current: {
        asNumber: currentEpoch,
        asBlockNumber: currentEpochAsBlockNumber,
        asTimestamp: this.toSeconds(currentEpochAsBlockNumber),
      },
      next: {
        asNumber: currentEpoch + 1,
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: this.toSeconds(nextEpochAsBlockNumber),
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

  async getTimeUntilEpochStart(epoch: number) {
    const blocks = await this.getBlocksUntilEpochStart(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksUntilEpochEnds(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    const blockStart = this.getBlockNumberOfEpochStart(epoch + 1);
    return blockStart - Number(blockNumber);
  }

  async getTimeUntilEpochEnds(epoch: number) {
    const blocks = await this.getBlocksUntilEpochEnds(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksSinceEpochStart(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    return Number(blockNumber) - this.getBlockNumberOfEpochStart(epoch);
  }

  async getTimeSinceEpochStart(epoch: number) {
    const blocks = await this.getBlocksSinceEpochStart(epoch);
    return this.toSeconds(blocks);
  }

  async getBlocksSinceEpochEnd(epoch: number) {
    const blockNumber = await this.getBlockNumber();
    return Number(blockNumber) - this.getBlockNumberOfEpochStart(epoch + 1);
  }

  async getTimeSinceEpochEnd(epoch: number) {
    const blocks = await this.getBlocksSinceEpochEnd(epoch);
    return this.toSeconds(blocks);
  }

  getBlockNumberOfEpochEnd(epoch: number) {
    return this.getBlockNumberOfEpochStart(epoch + 1);
  }
}
