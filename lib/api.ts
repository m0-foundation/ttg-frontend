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
import { iGovernorABI, readIGovernor, readIspogGovernor } from "./sdk";

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
  governor: string;
  vault: {
    cash?: string;
    vault?: string;
  };
  tokens: {
    cash?: string;
    vault?: string;
    vote?: string;
    value?: string;
    abc?: string;
  };
}

export interface ProposalVotesState {
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

export interface EpochState {
  current: {
    asNumber: number;
    asBlockNumber: BigInt;
    asTimestamp: BigInt;
  };
  next: {
    asNumber: number;
    asBlockNumber: BigInt;
    asTimestamp: BigInt;
  };
}

export interface VoteCast {
  proposalId: string;
  reason: string;
  support: boolean;
  voter: string;
  weight: BigInt;
  transactionHash?: string;
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

  async getProposals(): Promise<Array<MProposal>> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.governor as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)"
      ),
    });

    const proposals = rawLogs.map((log: Log) =>
      this.decodeProposalLog(log, iGovernorABI)
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

  async getProposalState(
    proposalId: string
  ): Promise<keyof typeof ProposalState> {
    const proposalStateNumber = await readIGovernor({
      address: this.config.governor as Hash,
      functionName: "state",
      args: [BigNumber.from(proposalId)],
    });

    return ProposalState[proposalStateNumber] as keyof typeof ProposalState;
  }

  async getProposalVotes(proposalId: string): Promise<ProposalVotesState> {
    const votes = await readIspogGovernor({
      address: this.config.governor as Hash,
      functionName: "proposalVotes",
      args: [BigNumber.from(proposalId)],
    });
    console.log({ votes });
    // const votes2 = await readIspogGovernor({
    //   address: this.config.governor as Hash,
    //   functionName: "proposalValueVotes",
    //   args: [BigNumber.from(proposalId)],
    // });
    // console.log({ votes2 });

    const no = Number(votes[0]);
    const yes = Number(votes[1]);
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

  async getProposalVoters(proposalId: string): Promise<VoteCast[]> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.governor as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
      ),
    });
    // TODO filter by proposalId on query logs directly
    const voters: Array<VoteCast> = rawLogs.map((log) => ({
      proposalId: log?.args?.proposalId?.toString(),
      reason: log?.args?.reason,
      support: Boolean(log?.args?.support),
      voter: log?.args?.voter.toString(),
      weight: log?.args?.weight,
      transactionHash: log.transactionHash?.toString(),
    }));

    return voters.filter((v) => v.proposalId === proposalId);
  }

  async getEpochState(): Promise<EpochState> {
    const contractAddress = this.config.governor as Hash;
    const currentEpoch = await readIspogGovernor({
      address: contractAddress,
      functionName: "currentEpoch",
    });

    const currentEpochAsBlockNumber = await readIspogGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch],
    }).then((bigNumber) => bigNumber.toBigInt());

    const nextEpochAsBlockNumber = await readIspogGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch.add(1)],
    }).then((bigNumber) => bigNumber.toBigInt());

    const currentEpochAsBlock = await this.client.getBlock({
      blockNumber: currentEpochAsBlockNumber,
    });

    const currentBlock = await this.client.getBlock();

    const avgBlockTimeInSeconds = 15n; // upperlimit for safety reasons
    const blockDiff = nextEpochAsBlockNumber - currentBlock.number!;
    const nextEpochAsTimestamp =
      currentBlock.timestamp + blockDiff * avgBlockTimeInSeconds;

    return {
      current: {
        asNumber: Number(currentEpoch.toBigInt()),
        asBlockNumber: currentEpochAsBlockNumber,
        asTimestamp: currentEpochAsBlock.timestamp,
      },
      next: {
        asNumber: Number(currentEpoch.toBigInt() + 1n),
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: nextEpochAsTimestamp,
      },
    };
  }
}
