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
  static #instance: Epoch;

  clockStartingTimestamp!: number;
  clockPeriod!: number;

  private constructor() {}

  public static get instance(): Epoch {
    if (!Epoch.#instance) {
      Epoch.#instance = new Epoch();
    }

    return Epoch.#instance;
  }

  setEpoch(clockStartingTimestamp: number, clockPeriod: number) {
    this.clockStartingTimestamp = Number(clockStartingTimestamp);
    this.clockPeriod = Number(clockPeriod);
  }

  getType(epoch: number) {
    return epoch % 2 === 0 ? EpochTypes.TRANSFER : EpochTypes.VOTING;
  }

  getEpochState(currentEpoch: number): MEpoch {
    const currentEpochStartAsTimestamp =
      this.getTimestampOfEpochStart(currentEpoch);

    const currentEpochEndAsTimestamp =
      this.getTimestampOfEpochEnd(currentEpoch);

    return {
      values: {
        clockPeriod: this.clockPeriod,
        clockStartingTimestamp: this.clockStartingTimestamp,
      },
      current: {
        asNumber: currentEpoch,
        asTimestamp: currentEpochStartAsTimestamp,
        end: {
          timestamp: currentEpochEndAsTimestamp,
        },
        start: {
          timestamp: currentEpochStartAsTimestamp,
        },
        type: this.getType(currentEpoch),
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
        type: this.getType(currentEpoch + 1),
      },
    };
  }

  getEpochFromTimestamp(timestamp: number) {
    return (
      Math.floor((timestamp - this.clockStartingTimestamp) / this.clockPeriod) +
      1
    );
  }

  getTimestampOfEpochStart(epoch: number) {
    return (epoch - 1) * this.clockPeriod + this.clockStartingTimestamp;
  }

  getTimestampOfEpochEnd(epoch: number) {
    return this.getTimestampOfEpochStart(epoch + 1);
  }
}
