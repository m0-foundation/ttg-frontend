export interface MGovernorContracts {
  cashToken: string;
  zeroToken: string;
  powerToken: string;
  governor?: string;
  registrar?: string;
}

export interface MGovernorValues {
  powerTokenQuorumRatio: string;
  zeroTokenQuorumRatio: string;
  proposalFee: string;
  minProposalFee: string;
  maxProposalFee: string;
  clock?: number;
  votingDelay?: string;
  votingPeriod?: string;
}

export type MGovernorState = MGovernorContracts & MGovernorValues;
