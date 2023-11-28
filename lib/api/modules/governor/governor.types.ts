export interface MGovernorContracts {
  cashToken: string;
  zeroToken: string;
  powerToken: string;
  governor?: string;
  registrar?: string;
}

export interface MGovernorValues {
  powerTokenThresholdRatio: string;
  zeroTokenThresholdRatio: string;
  proposalFee: string;
  clock?: number;
  votingDelay?: string;
  votingPeriod?: string;
}

export type MGovernorState = MGovernorContracts & MGovernorValues;
