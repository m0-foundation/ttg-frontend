import {
  Abi,
  Chain,
  createPublicClient,
  decodeEventLog,
  Hash,
  http,
  Log,
  parseAbiItem,
  PublicClient,
} from "viem";
import {
  iGovernorABI,
  iDualGovernorABI,
  readIspogGovernor,
  readIVoteToken,
  readIspog,
  ispogABI,
} from "./sdk";

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

export interface ProposalVotesState {
  total: bigint;
  yes: {
    count: bigint;
    ratio: bigint;
    percentage: bigint;
  };
  no: {
    count: bigint;
    ratio: bigint;
    percentage: bigint;
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

// export interface SpogValues {}
export interface SpogMutableValues {
  valueFixedInflation: BigInt;
  tax: BigInt;
  taxLowerBound: BigInt;
  taxUpperBound: BigInt;
  inflator: BigInt;
}

export interface SpogUnmutableValues {
  cash?: string;
  governor?: string;
  valueVault?: string;
  voteVault?: string;
  vote?: string;
  value?: string;
}

export type SpogValues = SpogUnmutableValues | SpogMutableValues;

export interface Config {
  multicall: string;
  deployedBlock: BigInt | string;
  spog: string;
  contracts?: SpogUnmutableValues;
}

export class SPOG {
  client: PublicClient;
  config: Config;
  chain: Chain;
  rpcUrl: string;

  constructor(rpcUrl: string, chain: Chain, config: Config) {
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

  addConfig(config: Partial<Config>): void {
    this.config = { ...this.config, ...config };
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
      address: this.config.contracts!.governor as Hash,
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
    const proposalStateNumber = await readIspogGovernor({
      address: this.config.contracts!.governor as Hash,
      functionName: "state",
      args: [BigInt(proposalId)],
    });

    return ProposalState[proposalStateNumber] as keyof typeof ProposalState;
  }

  async getProposalVotes(proposalId: string): Promise<ProposalVotesState> {
    const votes = await readIspogGovernor({
      address: this.config.contracts!.governor as Hash,
      functionName: "proposalVotes",
      args: [BigInt(proposalId)],
    });

    const no = votes[0];
    const yes = votes[1];

    const total = yes + no || 1n;

    const yesRatio = yes / total;
    const noRatio = no / total;
    const yesPercentage = yesRatio * 100n;
    const noPercentage = noRatio * 100n;

    return {
      total,
      yes: {
        count: yes,
        ratio: yesRatio,
        percentage: yesPercentage,
      },
      no: {
        count: no,
        ratio: noRatio,
        percentage: noPercentage,
      },
    };
  }

  async getProposalVoters(proposalId: string): Promise<VoteCast[]> {
    const deployedBlock: BigInt = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.contracts!.governor as Hash,
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
    const contractAddress = this.config.contracts!.governor as Hash;
    const currentEpoch = await readIspogGovernor({
      address: contractAddress,
      functionName: "currentEpoch",
    });

    const currentEpochAsBlockNumber = await readIspogGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch],
    });

    const nextEpochAsBlockNumber = await readIspogGovernor({
      address: contractAddress,
      functionName: "startOf",
      args: [currentEpoch + 1n],
    });

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
        asNumber: Number(currentEpoch),
        asBlockNumber: currentEpochAsBlockNumber,
        asTimestamp: currentEpochAsBlock.timestamp,
      },
      next: {
        asNumber: Number(currentEpoch + 1n),
        asBlockNumber: nextEpochAsBlockNumber,
        asTimestamp: nextEpochAsTimestamp,
      },
    };
  }

  getVoteDelegatorFrom(account: Hash): Promise<Hash> {
    return readIVoteToken({
      address: this.config.contracts!.vote as Hash,
      functionName: "delegates",
      args: [account],
    });
  }

  getParameters<T>(
    parameters: string[],
    contract: { address: Hash; abi: Abi }
  ): Promise<T> {
    const contractCalls = parameters.map((name) => ({
      ...contract,
      functionName: name,
    }));

    const decodeResults = (results: any[]): T => {
      const keys = results.map((r, i) => {
        const key = parameters[i];
        return { [key]: r.result };
      });

      const params = keys.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});

      return params as T;
    };

    return this.client
      .multicall({
        multicallAddress: this.config.multicall as Hash,
        contracts: contractCalls,
      })
      .then(decodeResults);
  }

  getSpogParameters<T>(parameters: string[]): Promise<T> {
    const contract = {
      address: this.config.spog as Hash,
      abi: ispogABI,
    };

    return this.getParameters<T>(parameters, contract);
  }

  async getContracts(): Promise<SpogUnmutableValues> {
    const spogContracts = await this.getSpogParameters<SpogUnmutableValues>([
      "cash",
      "governor",
      "valueVault",
      "voteVault",
    ]);

    const governorContracts = await this.getParameters<SpogUnmutableValues>(
      ["value", "vote"],
      {
        address: spogContracts.governor as Hash,
        abi: iDualGovernorABI,
      }
    );
    return { ...spogContracts, ...governorContracts };
  }

  getSpogValues(): Promise<SpogMutableValues> {
    return this.getSpogParameters<SpogMutableValues>([
      "valueFixedInflation",
      "tax",
      "inflator",
      "taxLowerBound",
      "taxUpperBound",
    ]);
  }

  getGovernorParameters<T>(parameters: string[]): Promise<T> {
    const contract = {
      address: this.config.contracts!.governor as Hash,
      abi: iDualGovernorABI,
    };

    return this.getParameters<T>(parameters, contract);
  }

  getGovernorContracts(): Promise<Partial<SpogUnmutableValues>> {
    return this.getGovernorParameters<SpogUnmutableValues>(["value", "vote"]);
  }
}
