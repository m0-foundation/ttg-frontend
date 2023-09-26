import { Hash } from "viem";

import { ApiModule, ApiContext } from "../..";
import { readDualGovernor } from "~/lib/sdk";

export class Epoch extends ApiModule {
  contract: Hash;

  constructor(context: ApiContext) {
    super(context);
    this.contract = this.config.contracts!.governor as Hash;
  }

  async getEpochState(): Promise<MEpoch> {
    const contractAddress = this.config.contracts!.governor as Hash;
    const currentEpoch = await readDualGovernor({
      address: contractAddress,
      functionName: "currentEpoch",
    });

    const currentEpochAsBlockNumber = await readDualGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch],
    });

    const nextEpochAsBlockNumber = await readDualGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch + 1n],
    });

    const currentEpochAsBlock = await this.client.getBlock({
      blockNumber: currentEpochAsBlockNumber,
    });

    const currentBlock = await this.client.getBlock();

    const avgBlockTimeInSeconds = 15n; // upperlimit for safety reasons
    const blockDiff = nextEpochAsBlockNumber - currentBlock.number!;
    const nextEpochAsTimestamp =
      currentBlock.timestamp + blockDiff * avgBlockTimeInSeconds;

    return {
      current: {
        asNumber: Number(currentEpoch),
        asBlockNumber: currentEpochAsBlockNumber,
        asTimestamp: currentEpochAsBlock.timestamp,
      },
      next: {
        asNumber: Number(currentEpoch + 1n),
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: nextEpochAsTimestamp,
      },
    };
  }
}
