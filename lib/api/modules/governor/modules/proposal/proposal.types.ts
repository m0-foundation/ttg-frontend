import { boolean } from "hardhat/internal/core/params/argumentTypes";
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
  Power = 0,
  Double = 1,
  Zero = 2,
  Emergency = 3,
}
export type MVotingType = keyof typeof VotingType;

export interface ProposalEventLog extends EventLog {
  values: Array<string>;
  proposalId: string;
  proposer: string;
  timestamp: number;
  description: string;
}

export interface MProposalTallies {
  power: {
    yes: string;
    no: string;
  };
  zero: {
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
  noPowerTokenVotes: bigint;
  yesPowerTokenVotes: bigint;
  noZeroTokenVotes: bigint;
  yesZeroTokenVotes: bigint;
}

export interface MProposal extends ProposalEventLog {
  isEmergency: boolean;
  proposalType: string;
  proposalLabel: string;
  proposalParams: any[];
  proposer: string;
  voteStart?: number;
  voteEnd?: number;
  executed?: boolean;
  executedEvent?: ProposalEventLog;
  state?: MProposalState;
  tallies?: MProposalTallies;
  votingType?: MVotingType;
  epoch?: number;
}

export interface MProposalsActionTypes {
  setPowerTokenQuorumRatio: string;
  setZeroTokenQuorumRatio: string;
  setProposalFee: string;
  setProposalFeeRange: string[];
}
