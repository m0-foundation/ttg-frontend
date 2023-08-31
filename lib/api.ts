import {
  Abi,
  bytesToHex,
  Chain,
  createPublicClient,
  decodeAbiParameters,
  parseAbiParameters,
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

import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";

import {
  ispogGovernorABI,
  readIspogGovernor,
  readVote,
  readValue,
  ispogABI,
} from "./sdk";

export interface EventLog {
  eventName: string;
  calldatas?: Array<string>;
  endBlock?: number;
  startBlock?: number;
  signatures?: Array<string>;
  targets?: Array<string>;
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

export interface MListEvent extends EventLog {
  eventName: "AddressAddedToList" | "AddressRemovedFromList";
  listName: string;
  account: string;
  timestamp: number;
}

export interface MLists {
  [listName: string]: Array<MListEvent>;
}

export interface MProtocolConfig {
  [valueName: string]: {
    value: string | number | bigint | Hash | object;
    timestamp: number;
  };
}

export interface MUpdateConfigEvent extends EventLog {
  valueName: string;
  value: string | number | bigint | Hash | object;
  timestamp: number;
}

export interface ProposalVotesState {
  total: bigint;
  yes: {
    count: bigint;
    ratio: bigint;
    percentage: number;
  };
  no: {
    count: bigint;
    ratio: bigint;
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
  multicall3: `0x${string}`;
  deployedBlock: BigInt | string;
  spog: string;
  contracts?: SpogImmutableValues;
}

const functionSelectors = {
  addToList: getFunctionSelector("addToList(bytes32,address)"),
  removeFromList: getFunctionSelector("removeFromList(bytes32,address)"),
  updateConfig: getFunctionSelector("updateConfig(bytes32,bytes32)"),
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

function removeSelectorFromCallData(callData: Hash) {
  return bytesToHex(fromHex(callData, "bytes").slice(4));
}

function hexToBytes32String(hex: string): string {
  return fromHex(hex as Hash, { size: 32, to: "string" });
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
      const selector = bytesToHex(
        fromHex(event.calldatas[0], "bytes").slice(0, 4)
      );

      let params: any[] = [];

      let proposalType = "";

      let isEmergency = false;

      function parseEmergency(emergencyType: number, callData: Hash) {
        if (emergencyType === 0) {
          proposalType = "removeFromList";
          const values = decodeAbiParameters(
            parseAbiParameters("bytes32 list, address account"),
            callData
          );

          params = [hexToBytes32String(values[0]), values[1]];
        } else if (emergencyType === 1) {
          proposalType = "addToList";

          const values = decodeAbiParameters(
            parseAbiParameters("bytes32 list, address account"),
            callData
          );
          params = [hexToBytes32String(values[0]), values[1]];
        } else if (emergencyType === 2) {
          proposalType = "updateConfig";

          params = decodeAbiParameters(
            [
              { name: "valueName", type: "bytes32" },
              { name: "value", type: "bytes32" },
            ],
            callData
          ).map(hexToBytes32String);
        }

        return [proposalType, params];
      }

      switch (selector) {
        case functionSelectors.addToList:
          proposalType = "addToList";
          params = decodeAbiParameters(
            [
              { name: "list", type: "bytes32" },
              { name: "account", type: "address" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          );

          params[0] = hexToBytes32String(params[0]);
          break;
        case functionSelectors.removeFromList:
          proposalType = "removeFromList";
          params = decodeAbiParameters(
            [
              { name: "list", type: "bytes32" },
              { name: "account", type: "address" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          );
          params[0] = hexToBytes32String(params[0]);
          break;
        case functionSelectors.updateConfig:
          proposalType = "updateConfig";
          params = decodeAbiParameters(
            [
              { name: "valueName", type: "bytes32" },
              { name: "value", type: "bytes32" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          ).map(hexToBytes32String);

          break;
        case functionSelectors.reset:
          proposalType = "reset";
          params = decodeAbiParameters(
            [
              { name: "newGovernor", type: "address" },
              { name: "newVoteVault", type: "address" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          );
          break;
        case functionSelectors.changeTax:
          proposalType = "changeTax";
          params = decodeAbiParameters(
            [{ name: "newTax", type: "uint256" }],
            removeSelectorFromCallData(event.calldatas[0])
          );
          break;
        case functionSelectors.changeTaxRange:
          proposalType = "changeTaxRange";
          params = decodeAbiParameters(
            [
              { name: "newTaxLowerBound", type: "uint256" },
              { name: "newTaxUpperBound", type: "uint256" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          );
          break;
        case functionSelectors.updateVoteQuorumNumerator:
          proposalType = "updateVoteQuorumNumerator";
          params = decodeAbiParameters(
            [{ name: "newVoteQuorumNumerator", type: "uint256" }],
            removeSelectorFromCallData(event.calldatas[0])
          );
          break;
        case functionSelectors.updateValueQuorumNumerator:
          proposalType = "updateValueQuorumNumerator";
          params = decodeAbiParameters(
            [{ name: "newValueQuorumNumerator", type: "uint256" }],
            removeSelectorFromCallData(event.calldatas[0])
          );
          break;
        case functionSelectors.emergency:
          isEmergency = true;

          params = decodeAbiParameters(
            [
              { name: "emergencyType", type: "uint8" },
              { name: "callData", type: "bytes" },
            ],
            removeSelectorFromCallData(event.calldatas[0])
          );

          [proposalType, params] = parseEmergency(params[0], params[1]);

          break;
        default:
          break;
      }

      const proposalLabels = {
        changeTax: "Change Tax",
        changeTaxRange: "Change Tax Range",
        addToList: "Add to list",
        removeFromList: "Remove from list",
        updateConfig: "Update Config",
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

  parseProposalVotes(votes: readonly [bigint, bigint]): ProposalVotesState {
    console.log("parse votes", votes);
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
        percentage: Number(yesPercentage),
      },
      no: {
        count: no,
        ratio: noRatio,
        percentage: Number(noPercentage),
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

  getVoteDelegates(account: Hash): Promise<Hash> {
    return readVote({
      address: this.config.contracts!.vote as Hash,
      functionName: "delegates",
      args: [account],
    });
  }

  getValueDelegates(account: Hash): Promise<Hash> {
    return readValue({
      address: this.config.contracts!.value as Hash,
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

      console.log("Get Params", params);
      return params as T;
    };

    return this.client
      .multicall({
        multicallAddress: this.config.multicall3 as Hash,
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

  toString(array: Array<any>) {
    return array.length > 0 ? array.map((v) => v.toString()) : [];
  }

  async decodeListLog(log: Log, abi: Abi): Promise<MListEvent> {
    interface MListDecoded {
      eventName: string;
      args: { listName: Hash; account: Hash };
    }

    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    }) as MListDecoded;

    if (event) {
      const block = await this.client.getBlock({
        blockNumber: log.blockNumber!,
      });

      const listEvent: MListEvent = {
        ...event,
        eventName: eventName as "AddressAddedToList" | "AddressRemovedFromList",
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        listName: hexToBytes32String(event.listName),
        account: event.account,
        timestamp: Number(block.timestamp),
      };

      return listEvent;
    }

    return {} as MListEvent;
  }

  async getLists(): Promise<Array<MLists>> {
    const deployedBlock = BigInt(this.config.deployedBlock.toString());

    const addRawLogs = await this.client.getLogs({
      address: this.config.spog as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event AddressAddedToList(bytes32 listName, address account)"
      ),
    });

    const removeRawLogs = await this.client.getLogs({
      address: this.config.spog as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event AddressRemovedFromList(bytes32 listName, address account)"
      ),
    });

    const addOperations = await Promise.all(
      addRawLogs.map((log: Log) => this.decodeListLog(log, ispogABI))
    );

    const removeOperations = await Promise.all(
      removeRawLogs.map((log: Log) => this.decodeListLog(log, ispogABI))
    );

    const listGrouped = groupBy(
      orderBy(
        [...addOperations, ...removeOperations],
        ["blockNumber"],
        ["asc"]
      ),
      "listName"
    );

    const lists: MLists[] = [];

    forEach(listGrouped, (events, key) => {
      let list = new Array<MListEvent>();

      events.forEach((event: MListEvent) => {
        if (event.eventName === "AddressAddedToList") {
          list.push(event);
        }

        if (event.eventName === "AddressRemovedFromList") {
          list = list.filter((e) => e.account !== event.account);
        }
      });

      lists.push({ [key]: list });
    });

    return lists;
  }

  async decodeProtocolConfigLog(
    log: Log,
    abi: Abi
  ): Promise<MUpdateConfigEvent> {
    interface MProtocolConfigDecoded {
      eventName: string;
      args: { valueName: Hash; value: Hash };
    }

    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    }) as MProtocolConfigDecoded;

    if (event) {
      const block = await this.client.getBlock({
        blockNumber: log.blockNumber!,
      });

      const updateConfigEvent: MUpdateConfigEvent = {
        ...event,
        eventName,
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        valueName: hexToBytes32String(event.valueName),
        value: hexToBytes32String(event.value),
        timestamp: Number(block.timestamp),
      };

      return updateConfigEvent;
    }

    return {} as MUpdateConfigEvent;
  }

  async getProtocolConfigs(): Promise<MProtocolConfig> {
    const deployedBlock = BigInt(this.config.deployedBlock.toString());

    const rawLogs = await this.client.getLogs({
      address: this.config.spog as Hash,
      fromBlock: deployedBlock,
      event: parseAbiItem(
        "event ConfigUpdated(bytes32 valueName, bytes32 value)"
      ),
    });

    const decodedLogs = await Promise.all(
      rawLogs.map((log: Log) => this.decodeProtocolConfigLog(log, ispogABI))
    );

    const orderedLogs = orderBy([...decodedLogs], ["blockNumber"], ["asc"]);

    const finalConfig = {} as MProtocolConfig;

    // guaranteed order
    for (const event of orderedLogs) {
      finalConfig[event.valueName] = {
        value: event.value,
        timestamp: event.timestamp,
      };
    }

    return finalConfig;
  }
}
