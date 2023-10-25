export enum EpochTypes {
  TRANSFER = "TRANSFER",
  VOTING = "VOTING",
}

export type EpochType = keyof typeof EpochTypes;

export interface MEpoch {
  current: {
    asNumber: number;
    asBlockNumber: number;
    asTimestamp: number;
    type: EpochType;
  };
  next: {
    asNumber: number;
    asBlockNumber: number;
    asTimestamp: number;
    type: EpochType;
  };
}
