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
import type { Abi, AbiParameter, ExtractAbiEventNames, Narrow } from "abitype";
import { spogABI, ispogGovernorABI, readGovernor } from "./generated";

export interface EventLog {
  eventName: string;
  calldatas: Array<string>;
  endBlock: BigInt;
  startBlock: BigInt;
  signatures: Array<string>;
  targets: Array<string>;
  values: Array<any>;
}

enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

export interface MProposal extends EventLog {
  proposer: string;
  proposalId: BigInt;
  description: string;
  state?: ProposalState;
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

export class SPOG {
  client: PublicClient;
  config: ConfigVars;

  constructor(rpcUrl: string, chain: Chain, config: ConfigVars) {
    this.client = createPublicClient({ chain, transport: http(rpcUrl) });
    this.config = config;
  }

  decodeProposalLog(log: Log, abi: object): MProposal {
    const { eventName, args } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    });

    const proposal: MProposal = {
      eventName,
      ...args,
    };
    return proposal;
  }

  async getGovernorVoteProposals(): Promise<MProposal> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.governor.vote as Hash,
      fromBlock: deployedBlock,
    });

    return rawLogs.map((log: Log) =>
      this.decodeProposalLog(log, ispogGovernorABI)
    );
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
}
