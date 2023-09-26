import { EventLog } from "../event/event.types";

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

export interface ProposalEventLog extends EventLog {
  values: Array<string>;
  proposalId: string;
  proposer: string;
  timestamp: number;
  description: string;
}

export interface MProposal extends ProposalEventLog {
  isEmergency: boolean;
  proposalType: string;
  proposalLabel: string;
  proposalParams: any[];
  state?: keyof typeof ProposalState;
}

export interface MProposalVotesState {
  total: number;
  yes: {
    count: number;
    ratio: number;
    percentage: number;
  };
  no: {
    count: number;
    ratio: number;
    percentage: number;
  };
}
