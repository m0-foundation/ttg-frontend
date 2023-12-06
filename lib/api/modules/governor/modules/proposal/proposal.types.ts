import { Hash } from "viem";
import { EventLog } from "../../../event/event.types";

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}
export type MProposalState = keyof typeof ProposalState;

export enum VotingType {
  Standard = 0,
  Emergency = 1,
  Zero = 2,
}
export type MVotingType = keyof typeof VotingType;

export interface ProposalEventLog extends EventLog {
  values: Array<string>;
  proposalId: string;
  proposer: string;
  timestamp: number;
  description: string;
  voteStart: number;
  voteEnd: number;
}

export interface MProposalTallies {
  power?: {
    yes: string;
    no: string;
  };
  zero?: {
    yes: string;
    no: string;
  };
}

export interface GetProposalOutput {
  proposer: string;
  voteStart: number;
  voteEnd: number;
  executed: boolean;
  state: MProposalState;
  votingType: MVotingType;
  noVotes: bigint;
  yesVotes: bigint;
}

export interface MProposal extends ProposalEventLog {
  isEmergency: boolean;
  proposalType: string;
  proposalLabel: string;
  proposalParams: any[];
  proposer: string;
  executed?: boolean;
  state?: MProposalState;
  tallies?: MProposalTallies;
  votingType?: MVotingType;
  epoch?: number;
  governor: Hash; // governor address where it is stored
}

export interface MProposalsActionTypes {
  setEmergencyProposalThresholdRatio: string;
  setZeroProposalThresholdRatio: string;
  setProposalFee: string;
}
