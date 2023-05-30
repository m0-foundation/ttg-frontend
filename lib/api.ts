import {
  Chain,
  createPublicClient,
  decodeEventLog,
  Hash,
  http,
  Log,
  parseAbiItem,
  PublicClient,
} from "viem";
import { BigNumber } from "ethers";
import type { Abi } from "abitype";
import {
  spogABI,
  ispogGovernorABI,
  readGovernor,
  readSpogGovernor,
} from "./generated";

export interface EventLog {
  eventName: string;
  calldatas: Array<string>;
  endBlock: number;
  startBlock: number;
  signatures: Array<string>;
  targets: Array<string>;
  blockNumber: number;
  transactionHash: string;
}

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

export interface MProposal extends EventLog {
  proposer: string;
  proposalId: string;
  description: string;
  state?: keyof typeof ProposalState;
  timestamp: number;
}

export interface ConfigVars {
  deployedBlock: BigInt;
  spog: string;
  governor: {
    vote: string;
    value?: string;
  };
  tokens: {
    cash?: string;
    vault?: string;
    vote?: string;
    value?: string;
    abc?: string;
  };
}

export interface VotesResult {
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

export class SPOG {
  client: PublicClient;
  config: ConfigVars;
  chain: Chain;
  rpcUrl: string;

  constructor(rpcUrl: string, chain: Chain, config: ConfigVars) {
    this.client = createPublicClient({ chain, transport: http(rpcUrl) });
    this.config = config;
    this.chain = chain;
    this.rpcUrl = rpcUrl;
  }

  setRpc(rpcUrl: string) {
    this.client = createPublicClient({
      chain: this.chain,
      transport: http(rpcUrl),
    });
  }

  decodeProposalLog(log: Log, abi: object): MProposal {
    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    });

    const toString = (array: Array<any>) =>
      array.length > 0 ? array.map((v) => v.toString()) : [];

    if (event) {
      const proposal: MProposal = {
        ...event,
        eventName,
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        values: toString(event.values),
        signatures: toString(event.signatures),
        calldatas: toString(event.calldatas),
        targets: toString(event.targets),
        endBlock: Number(event.endBlock),
        startBlock: Number(event.startBlock),
        proposalId: String(event.proposalId),
      };

      return proposal;
    }

    return {} as MProposal;
  }

  async getGovernorVoteProposals(): Promise<Array<MProposal>> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.governor.vote as Hash,
      fromBlock: deployedBlock,
    });

    const proposals = rawLogs.map((log: Log) =>
      this.decodeProposalLog(log, ispogGovernorABI)
    );

    const proposalsWithState = await Promise.all(
      proposals.map(async (proposal) => {
        const state = await this.getProposalState(
          proposal.proposalId.toString()
        );

        const block = await this.client.getBlock({
          blockNumber: BigInt(proposal.blockNumber),
        });

        proposal.state = state;
        proposal.timestamp = Number(block.timestamp);
        return proposal;
      })
    );

    return proposalsWithState;
  }

  async getSpogProposals(): Promise<MProposal[]> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.spog as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)"
      ),
    });

    return rawLogs.map((log: Log) => this.decodeProposalLog(log, spogABI));
  }

  async getProposalState(
    proposalId: string
  ): Promise<keyof typeof ProposalState> {
    const proposalStateNumber = await readGovernor({
      address: this.config.governor.vote as Hash,
      functionName: "state",
      args: [BigNumber.from(proposalId)],
    });

    return ProposalState[proposalStateNumber] as keyof typeof ProposalState;
  }

  async getProposalVotes(proposalId: string): Promise<VotesResult> {
    const votes = await readSpogGovernor({
      address: this.config.governor.vote as Hash,
      functionName: "proposalVotes",
      args: [BigNumber.from(proposalId)],
    });

    const yes = Number(votes.yesVotes);
    const no = Number(votes.noVotes);
    const total = yes + no;
    const yesRatio = yes / total;
    const noRatio = yes / total;
    const yesPercentage = yesRatio * 100;
    const noPercentage = noRatio * 100;

    return {
      total,
      yes: {
        count: yes,
        ratio: yesRatio || 0,
        percentage: yesPercentage || 0,
      },
      no: {
        count: no,
        ratio: noRatio || 0,
        percentage: noPercentage || 0,
      },
    };
  }
}
