export interface MGovernorValues {
  thresholdRatio: string;
}

export interface MStandardGovernorValues {
  cashToken: string;
  proposalFee: string;
  maxTotalZeroRewardPerActiveEpoch: string;
}

export type MGovernorState = MGovernorValues;
