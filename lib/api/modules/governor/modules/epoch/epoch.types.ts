export interface MEpoch {
  current: {
    asNumber: number;
    asBlockNumber: number;
    asTimestamp: number;
  };
  next: {
    asNumber: number;
    asBlockNumber: number;
    asTimestamp: number;
  };
}
