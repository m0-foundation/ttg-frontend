export interface MEpoch {
  current: {
    asNumber: number;
    asBlockNumber: BigInt;
    asTimestamp: BigInt;
  };
  next: {
    asNumber: number;
    asBlockNumber: BigInt;
    asTimestamp: BigInt;
  };
}
