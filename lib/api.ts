import {
  Abi,
  bytesToHex,
  Chain,
  createPublicClient,
  decodeAbiParameters,
  decodeEventLog,
  formatEther,
  getFunctionSelector,
  fromHex,
  Hash,
  http,
  Log,
  parseAbiItem,
  PublicClient,
} from "viem";

import { readContract } from "@wagmi/core";

import {
  ispogGovernorABI,
  readIspogGovernor,
  readIVoteToken,
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
  isEmergency: boolean;
  proposer: string;
  proposalId: string;
  proposalType: string;
  proposalLabel: string;
  proposalParams: any[];
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

export interface SpogMutableValues {
  tax: bigint;
  taxLowerBound: bigint;
  taxUpperBound: bigint;
}

export interface SpogImmutableValues {
  cash?: string;
  governor?: string;
  valueVault?: string;
  voteVault?: string;
  vote?: string;
  value?: string;
}

export interface GovernorValues {
  voteQuorumNumerator: bigint;
  valueQuorumNumerator: bigint;
}

export interface CurrentProposalValues {
  changeTax: string;
  changeTaxRange: string[];
  updateVoteQuorumNumerator: string;
  updateValueQuorumNumerator: string;
}

export type SpogValues = SpogImmutableValues & SpogMutableValues;

export interface Config {
  deployedBlock: BigInt | string;
  spog: string;
  contracts?: SpogImmutableValues;
}

const functionSelectors = {
  addList: getFunctionSelector("addList(address)"),
  append: getFunctionSelector("append(address,address)"),
  remove: getFunctionSelector("remove(address,address)"),
  changeConfig: getFunctionSelector("changeConfig(bytes32,address,bytes4)"),
  emergency: getFunctionSelector("emergency(uint8,bytes)"),
  reset: getFunctionSelector("reset(address,address)"),
  changeTax: getFunctionSelector("changeTax(uint256)"),
  changeTaxRange: getFunctionSelector("changeTaxRange(uint256,uint256)"),
  updateVoteQuorumNumerator: getFunctionSelector(
    "updateVoteQuorumNumerator(uint256)"
  ),
  updateValueQuorumNumerator: getFunctionSelector(
    "updateValueQuorumNumerator(uint256)"
  ),
};

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
      const selector = bytesToHex(
        fromHex(event.calldatas[0], "bytes").slice(0, 4)
      );

      let params: any[] = [];

      let proposalType = "";

      let isEmergency = false;

      function parseEmergency(emergencyType: number, callData: Hash) {
        if (emergencyType === 0) {
          proposalType = "remove";
          params = decodeAbiParameters(
            [
              { name: "list", type: "address" },
              { name: "account", type: "address" },
            ],
            bytesToHex(fromHex(callData, "bytes").slice(4))
          );
        } else if (emergencyType === 1) {
          proposalType = "append";
          params = decodeAbiParameters(
            [
              { name: "list", type: "address" },
              { name: "account", type: "address" },
            ],
            bytesToHex(fromHex(callData, "bytes").slice(4))
          );
        } else if (emergencyType === 2) {
          proposalType = "changeConfig";
          params = decodeAbiParameters(
            [
              { name: "configName", type: "bytes32" },
              { name: "configAddress", type: "address" },
              { name: "interfaceId", type: "bytes4" },
            ],
            bytesToHex(fromHex(callData, "bytes").slice(4))
          );
        }

        return [proposalType, params];
      }

      switch (selector) {
        case functionSelectors.addList:
          proposalType = "addList";
          params = decodeAbiParameters(
            [{ name: "list", type: "address" }],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.append:
          proposalType = "append";
          params = decodeAbiParameters(
            [
              { name: "list", type: "address" },
              { name: "account", type: "address" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.remove:
          proposalType = "remove";
          params = decodeAbiParameters(
            [
              { name: "list", type: "address" },
              { name: "account", type: "address" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.changeConfig:
          proposalType = "changeConfig";
          params = decodeAbiParameters(
            [
              { name: "configName", type: "bytes32" },
              { name: "configAddress", type: "address" },
              { name: "interfaceId", type: "bytes4" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.reset:
          proposalType = "reset";
          params = decodeAbiParameters(
            [
              { name: "newGovernor", type: "address" },
              { name: "newVoteVault", type: "address" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.changeTax:
          proposalType = "changeTax";
          params = decodeAbiParameters(
            [{ name: "newTax", type: "uint256" }],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.changeTaxRange:
          proposalType = "changeTax";
          params = decodeAbiParameters(
            [
              { name: "newTaxLowerBound", type: "uint256" },
              { name: "newTaxUpperBound", type: "uint256" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.updateVoteQuorumNumerator:
          proposalType = "updateVoteQuorumNumerator";
          params = decodeAbiParameters(
            [{ name: "newVoteQuorumNumerator", type: "uint256" }],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.updateValueQuorumNumerator:
          proposalType = "updateValueQuorumNumerator";
          params = decodeAbiParameters(
            [{ name: "newValueQuorumNumerator", type: "uint256" }],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );
          break;
        case functionSelectors.emergency:
          isEmergency = true;

          params = decodeAbiParameters(
            [
              { name: "emergencyType", type: "uint8" },
              { name: "callData", type: "bytes" },
            ],
            bytesToHex(fromHex(event.calldatas[0], "bytes").slice(4))
          );

          [proposalType, params] = parseEmergency(params[0], params[1]);

          break;
        default:
          break;
      }

      const proposalLabels = {
        addList: "Add List",
        changeTax: "Change Tax",
        changeTaxRange: "Change Tax Range",
        append: "Append to list",
        remove: "Remove from list",
        changeConfig: "Change Config",
        reset: "Reset Vote Holders",
        updateVoteQuorumNumerator: "Update Vote Quorum",
        updateValueQuorumNumerator: "Update Value Quorum",
      };

      const proposalLabel =
        proposalLabels[proposalType as keyof typeof proposalLabels];

      const proposal: MProposal = {
        ...event,
        isEmergency,
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
        proposalType: String(proposalType),
        proposalLabel,
        proposalParams: toString(params),
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
    const contractCalls = parameters.map((functionName) => {
      return readContract({
        abi: contract.abi as Abi,
        address: contract.address as Hash,
        functionName,
      });
    });

    const decodeResults = (results: any[]): T =>
      results.reduce(
        (acc, cur, i) => ({ ...acc, [parameters[i]]: cur }),
        {}
      ) as T;

    return Promise.all(contractCalls).then(decodeResults);
  }

  getSpogParameters<T>(parameters: string[]): Promise<T> {
    const contract = {
      address: this.config.spog as Hash,
      abi: ispogABI,
    };

    return this.getParameters<T>(parameters, contract);
  }

  async getContracts(): Promise<SpogImmutableValues> {
    const spogContracts = await this.getSpogParameters<SpogImmutableValues>([
      "cash",
      "governor",
      "valueVault",
      "voteVault",
    ]);

    const governorContracts = await this.getParameters<SpogImmutableValues>(
      ["value", "vote"],
      {
        address: spogContracts.governor as Hash,
        abi: ispogGovernorABI,
      }
    );
    return { ...spogContracts, ...governorContracts };
  }

  getSpogValues(): Promise<SpogMutableValues> {
    return this.getSpogParameters<SpogMutableValues>([
      "inflator",
      "valueFixedInflation",
      "tax",
      "taxLowerBound",
      "taxUpperBound",
    ]);
  }

  getGovernorParameters<T>(parameters: string[]): Promise<T> {
    const contract = {
      address: this.config.contracts!.governor as Hash,
      abi: ispogGovernorABI,
    };

    return this.getParameters<T>(parameters, contract);
  }

  getGovernorValues(): Promise<GovernorValues> {
    return this.getGovernorParameters<GovernorValues>([
      "voteQuorumNumerator",
      "valueQuorumNumerator",
    ]);
  }

  getGovernorContracts(): Promise<Partial<SpogImmutableValues>> {
    return this.getGovernorParameters<SpogImmutableValues>(["value", "vote"]);
  }

  async getCurrentProposalValues(): Promise<CurrentProposalValues> {
    const spogValues = await this.getSpogValues();
    const governorValues = await this.getGovernorValues();
    const values = {
      changeTax: formatEther(spogValues?.tax || 0n),
      changeTaxRange: [
        formatEther(spogValues?.taxLowerBound || 0n),
        formatEther(spogValues?.taxUpperBound || 0n),
      ],

      updateVoteQuorumNumerator: governorValues?.voteQuorumNumerator.toString(),

      updateValueQuorumNumerator:
        governorValues?.valueQuorumNumerator.toString(),
    };

    return values;
  }
}
