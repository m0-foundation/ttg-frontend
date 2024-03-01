export enum EpochTypes {
  TRANSFER = "TRANSFER",
  VOTING = "VOTING",
}

export type EpochType = keyof typeof EpochTypes;

export interface MEpoch {
  current: {
    asNumber: number;
    asTimestamp: number;
    end: {
      timestamp: number;
    };
    start: {
      timestamp: number;
    };
    type: EpochType;
  };
  next: {
    asNumber: number;
    asTimestamp: number;
    end: {
      timestamp: number;
    };
    start: {
      timestamp: number;
    };
    type: EpochType;
  };
}
