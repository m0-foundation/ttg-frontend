import { PublicClient } from "viem";
import { EpochTypes, MEpoch } from "./epoch.types";

/*
unused vars but usefull to control hardhat and cypress
_EPOCH_PERIOD = 34; //  _EPOCH_PERIOD_SECONDS/_SECONDS_PER_BLOCK 400/12
_SECONDS_PER_BLOCK = 12;
see files:
- cypress/support/commands.ts#L136
- hardhat.config.js#L12
*/

export class Epoch {
  client: PublicClient;

  static _STARTING_TIMESTAMP = 1_713_099_600;
  static _EPOCH_PERIOD_SECONDS = 1_296_000; //15 days in seconds

  constructor(client: PublicClient) {
    this.client = client;
  }

  async getCurrentBlockTimestamp(): Promise<bigint> {
    return await this.client.getBlock().then((block) => block.timestamp);
  }

  getEpochState(currentEpoch: number): MEpoch {
    const currentEpochStartAsTimestamp =
      this.getTimestampOfEpochStart(currentEpoch);

    const currentEpochEndAsTimestamp =
      this.getTimestampOfEpochEnd(currentEpoch);

    const getType = (epoch: number) =>
      epoch % 2 === 0 ? EpochTypes.TRANSFER : EpochTypes.VOTING;

    console.log({
      currentEpoch,
      currentEpochStart: currentEpochStartAsTimestamp,
      currentEpochEnd: currentEpochEndAsTimestamp,
      type: getType(currentEpoch),
    });

    return {
      current: {
        asNumber: currentEpoch,
        asTimestamp: currentEpochStartAsTimestamp,
        end: {
          timestamp: currentEpochEndAsTimestamp,
        },
        start: {
          timestamp: currentEpochStartAsTimestamp,
        },
        type: getType(currentEpoch),
      },
      next: {
        asNumber: currentEpoch + 1,
        asTimestamp: currentEpochEndAsTimestamp,
        end: {
          timestamp: currentEpochEndAsTimestamp,
        },
        start: {
          timestamp: currentEpochStartAsTimestamp,
        },
        type: getType(currentEpoch + 1),
      },
    };
  }

  static getEpochFromTimestamp(timestamp: number) {
    return (
      Math.floor(
        (timestamp - Epoch._STARTING_TIMESTAMP) / Epoch._EPOCH_PERIOD_SECONDS,
      ) + 1
    );
  }

  getTimestampOfEpochStart(epoch: number) {
    return (
      (epoch - 1) * Epoch._EPOCH_PERIOD_SECONDS + Epoch._STARTING_TIMESTAMP
    );
  }

  getTimestampOfEpochEnd(epoch: number) {
    return this.getTimestampOfEpochStart(epoch + 1);
  }
}
