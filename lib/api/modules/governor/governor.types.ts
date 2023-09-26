export interface MGovernorState {
  powerTokenQuorumRatio: bigint;
  zeroTokenQuorumRatio: bigint;

  proposalFee: bigint;
  minProposalFee: bigint;
  maxProposalFee: bigint;

  clock: string;
  cashToken: string;
  zeroToken: string;
  powerToken: string;
}
