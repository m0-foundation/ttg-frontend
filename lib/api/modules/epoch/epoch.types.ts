export enum EpochTypes {
  TRANSFER = "TRANSFER",
  VOTING = "VOTING",
}

export type EpochType = keyof typeof EpochTypes;

export interface MEpoch {
  current: {
    asNumber: number;
    asTimestamp: number;
    type: EpochType;
    end: {
      timestamp: number;
    };
  };
  next: {
    asNumber: number;
    asTimestamp: number;
    type: EpochType;
  };
}
