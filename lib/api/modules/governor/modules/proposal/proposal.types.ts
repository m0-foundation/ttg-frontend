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

export interface MProposalMutable {
  state: MProposalState;
  noVotes: bigint;
  yesVotes: bigint;
  quorum: bigint;
}

export interface MProposal extends ProposalEventLog, MProposalMutable {
  isEmergency: boolean;
  proposalType: string;
  proposalLabel: string;
  proposalParams: any[];
  proposer: string;
  executedEvent?: ProposalEventLog;
  votingType?: MVotingType;
  epoch?: number;
  governor: Hash; // governor address where it is stored
}

export interface MProposalsActionTypes {
  setEmergencyProposalThresholdRatio: string;
  setZeroProposalThresholdRatio: string;
  setProposalFee: string;
  setCashToken: string;
}
