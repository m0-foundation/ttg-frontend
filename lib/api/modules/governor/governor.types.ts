export interface MGovernorContracts {
  clock: string;
  cashToken: string;
  zeroToken: string;
  powerToken: string;
}

export interface MGovernorValues {
  powerTokenQuorumRatio: bigint;
  zeroTokenQuorumRatio: bigint;
  proposalFee: bigint;
  minProposalFee: bigint;
  maxProposalFee: bigint;
}

export type MGovernorState = MGovernorContracts & MGovernorValues;
