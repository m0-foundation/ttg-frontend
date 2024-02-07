import {
  Abi,
  Hash,
  Log,
  bytesToHex,
  decodeAbiParameters,
  decodeEventLog,
  fromHex,
  toFunctionSelector,
  parseAbiItem,
} from "viem";

import pick from "lodash/pick";

import { GovernorModule } from "../GovernorModule";
import { GovernanceType } from "../../governor.types";
import {
  GetProposalOutput,
  MProposal,
  MProposalTallies,
  ProposalEventLog,
  ProposalState,
} from "./proposal.types";
import {
  hexWith32BytesToString,
  removeSelectorFromCallData,
  hexWith32BytesToAddress,
} from "@/lib/api/utils";

import { ApiContext } from "@/lib/api/api-context";
import { Epoch } from "~/lib/api/modules/epoch/epoch";

const ProposalTypesFunctionSelectors = {
  addToList: toFunctionSelector("addToList(bytes32,address)"),
  removeFromList: toFunctionSelector("removeFromList(bytes32,address)"),
  removeFromAndAddToList: toFunctionSelector(
    "removeFromAndAddToList(bytes32,address,address)"
  ),
  setKey: toFunctionSelector("setKey(bytes32,bytes32)"),

  resetToPowerHolders: toFunctionSelector("resetToPowerHolders()"),
  resetToZeroHolders: toFunctionSelector("resetToZeroHolders()"),
  setProposalFee: toFunctionSelector("setProposalFee(uint256)"),
  setCashToken: toFunctionSelector("setCashToken(address,uint256)"),
  setStandardProposalFee: toFunctionSelector("setStandardProposalFee(uint256)"),
  setEmergencyProposalThresholdRatio: toFunctionSelector(
    "setEmergencyProposalThresholdRatio(uint16)"
  ),
  setZeroProposalThresholdRatio: toFunctionSelector(
    "setZeroProposalThresholdRatio(uint16)"
  ),
};

const ProposalLabels = {
  setProposalFee: "Change Proposal Fee",
  addToList: "Add to list",
  removeFromList: "Remove from list",
  removeFromAndAddToList: "Remove from and Add to List",
  setKey: "Set Config",
  resetToPowerHolders: "Reset to Power Holders",
  resetToZeroHolders: "Reset to Zero Holders",
  setEmergencyProposalThresholdRatio: "Update Power Threshold",
  setZeroProposalThresholdRatio: "Update Zero Threshold",
  setCashToken: "Set Cash Token",
};

type IParams =
  | readonly [`0x${string}`, `0x${string}`]
  | readonly [bigint]
  | readonly [bigint, bigint]
  | readonly [bigint, bigint, bigint]
  | readonly [number]
  | readonly [`0x${string}`, bigint]
  | string[]
  | string;

export class Proposals extends GovernorModule {
  fromBlock: bigint;
  abi: Abi;
  governanceType: GovernanceType;

  constructor(
    governor: Hash,
    context: ApiContext,
    abi: Abi,
    governanceType: GovernanceType
  ) {
    super(governor, context);
    this.governanceType = governanceType;
    this.abi = abi;
    this.fromBlock = this.config.deploymentBlock; // is necessary for getLogs, otherwise gets from latest blocks, but inrelanvent for peforfmance
  }

  decodeProposalTypeAddToList(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [
        { name: "list_", type: "bytes32" },
        { name: "account_", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType,
      params: [hexWith32BytesToString(params[0]), params[1]],
    };
  }

  decodeProposalRemoveFromList(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [
        { name: "list_", type: "bytes32" },
        { name: "account_", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType,
      params: [hexWith32BytesToString(params[0]), params[1]],
    };
  }

  decodeProposalRemoveFromAndAddToList(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [
        { name: "list_", type: "bytes32" },
        { name: "accountToRemove", type: "address" },
        { name: "accountToAdd", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType,
      params: [hexWith32BytesToString(params[0]), params[1], params[2]],
    };
  }

  decodeProposalTypeSetKey(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [
        { name: "key_", type: "bytes32" },
        { name: "value_", type: "bytes32" },
      ],
      removeSelectorFromCallData(calldata)
    );
    const key = hexWith32BytesToString(params[0]);
    const value = ["minter_rate_model", "earner_rate_model"].includes(key)
      ? hexWith32BytesToAddress(params[1])
      : hexWith32BytesToString(params[1]);

    return { proposalType, params: [key, value] };
  }

  decodeProposalTypeReset(proposalType: string) {
    return { proposalType, params: [] };
  }

  decodeProposalTypeSetCashToken(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "newCashToken_", type: "address" },
        { name: "newProposalFee_", type: "uint256" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setCashToken", params };
  }

  decodeProposalTypeSetProposalFee(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [{ name: "newProposalFee_", type: "uint256" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType, params };
  }

  decodeProposalTypeSetEmergencyProposalThresholdRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newThresholdRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setEmergencyProposalThresholdRatio", params };
  }

  decodeProposalTypeSetZeroProposalThresholdRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newThresholdRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setZeroProposalThresholdRatio", params };
  }

  decodeProposalTypes(
    selector: Hash,
    calldata: Hash
  ): { proposalType: string; params: IParams } {
    switch (selector) {
      case ProposalTypesFunctionSelectors.addToList:
        return this.decodeProposalTypeAddToList(calldata, "addToList");
        break;

      case ProposalTypesFunctionSelectors.removeFromList:
        return this.decodeProposalRemoveFromList(calldata, "removeFromList");
        break;

      case ProposalTypesFunctionSelectors.removeFromAndAddToList:
        return this.decodeProposalRemoveFromAndAddToList(
          calldata,
          "removeFromAndAddToList"
        );
        break;

      case ProposalTypesFunctionSelectors.setKey:
        return this.decodeProposalTypeSetKey(calldata, "setKey");
        break;

      case ProposalTypesFunctionSelectors.resetToZeroHolders:
        return this.decodeProposalTypeReset("resetToZeroHolders");
        break;

      case ProposalTypesFunctionSelectors.resetToPowerHolders:
        return this.decodeProposalTypeReset("resetToPowerHolders");
        break;

      case ProposalTypesFunctionSelectors.setProposalFee:
        return this.decodeProposalTypeSetProposalFee(
          calldata,
          "setProposalFee"
        );
        break;

      case ProposalTypesFunctionSelectors.setStandardProposalFee:
        return this.decodeProposalTypeSetProposalFee(
          calldata,
          "setProposalFee"
        );
        break;

      case ProposalTypesFunctionSelectors.setEmergencyProposalThresholdRatio:
        return this.decodeProposalTypeSetEmergencyProposalThresholdRatio(
          calldata
        );
        break;

      case ProposalTypesFunctionSelectors.setZeroProposalThresholdRatio:
        return this.decodeProposalTypeSetZeroProposalThresholdRatio(calldata);
        break;

      case ProposalTypesFunctionSelectors.setCashToken:
        return this.decodeProposalTypeSetCashToken(calldata);
        break;

      default:
        return { proposalType: "unknown", params: [] };
        break;
    }
  }

  toString<T>(array: Array<T | any>) {
    return array.length > 0 ? array.map((v) => String(v)) : [];
  }

  decodeProposalLog(log: Log, abi: Abi): MProposal {
    const { eventName, args } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    });

    const event = args as ProposalEventLog;

    if (event) {
      event.calldatas = event.callDatas as Array<Hash>;

      const calldataContent = event.calldatas[0] as Hash;

      const selector = bytesToHex(
        fromHex(calldataContent, "bytes").slice(0, 4)
      );

      const isEmergency = this.isEmergencyProposal();

      const { proposalType, params } = this.decodeProposalTypes(
        selector,
        calldataContent
      );

      const proposalLabel =
        ProposalLabels[proposalType as keyof typeof ProposalLabels];

      const proposal: MProposal = {
        isEmergency,
        eventName,
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        values: this.toString(event.values),
        signatures: this.toString(event.signatures!),
        calldatas: this.toString(event.calldatas),
        targets: this.toString(event.targets!),
        voteStart: event.voteStart,
        voteEnd: event.voteEnd,
        proposer: event.proposer,
        description: event.description,
        timestamp: event.timestamp,
        proposalId: String(event.proposalId),
        proposalType: String(proposalType),
        proposalParams: this.toString([...params]),
        proposalLabel,
        governor: this.contract,
      };

      return proposal;
    }

    return {} as MProposal;
  }

  decodeReadGetProposal(proposal: any) {
    const [voteStart, voteEnd, state, noVotes, yesVotes, proposer] = proposal;

    return {
      proposer: proposer as Hash,
      voteStart,
      voteEnd,
      state: ProposalState[state] as keyof typeof ProposalState,
      votingType: this.governanceType,
      yesVotes,
      noVotes,
    };
  }

  async readGetProposal(proposalId: string): Promise<GetProposalOutput> {
    console.log({
      proposalId,
      contract: this.contract,
      governanceType: this.governanceType,
    });
    const getProposal = await this.client.readContract({
      abi: this.abi,
      address: this.contract,
      functionName: "getProposal",
      args: [BigInt(proposalId)],
    });
    return this.decodeReadGetProposal(getProposal);
  }

  async presenterProposal({
    proposal,
    readGetProposal,
  }: {
    proposal: MProposal;
    readGetProposal: GetProposalOutput;
  }): Promise<MProposal> {
    const block = await this.client.getBlock({
      blockNumber: BigInt(proposal.blockNumber),
    });

    const epoch = Epoch.getEpochFromTimestamp(Number(block.timestamp));

    return {
      ...proposal,
      ...pick(readGetProposal, [
        "proposer",
        "voteStart",
        "voteEnd",
        "state",
        "votingType",
      ]),
      epoch,
      timestamp: Number(block.timestamp),
      tallies:
        readGetProposal.votingType === "Zero"
          ? {
              zero: {
                yes: String(readGetProposal.yesVotes),
                no: String(readGetProposal.noVotes),
              },
            }
          : {
              power: {
                yes: String(readGetProposal.yesVotes),
                no: String(readGetProposal.noVotes),
              },
            },
    };
  }

  async getProposalTallies(
    proposalId: string
  ): Promise<{ proposalId: string; tallies: MProposalTallies }> {
    const readGetProposal = await this.readGetProposal(proposalId);

    return {
      proposalId,
      tallies:
        readGetProposal.votingType === "Zero"
          ? {
              zero: {
                yes: String(readGetProposal.yesVotes),
                no: String(readGetProposal.noVotes),
              },
            }
          : {
              power: {
                yes: String(readGetProposal.yesVotes),
                no: String(readGetProposal.noVotes),
              },
            },
    };
  }

  isEmergencyProposal() {
    return this.governanceType === "Emergency";
  }

  async getRawExecutedLogs() {
    return await this.client.getLogs({
      address: this.contract as Hash,
      fromBlock: this.fromBlock,
      event: parseAbiItem("event ProposalExecuted(uint256 proposalId)"),
    });
  }

  async findExecutedEvent(proposalId: string, logs: Log[]) {
    const executedEvent = logs.find(
      (p) => String(p.args.proposalId) === proposalId
    );

    if (executedEvent) {
      const block = await this.client.getBlock({
        blockNumber: executedEvent.blockNumber as bigint,
      });

      return {
        ...executedEvent,
        timestamp: Number(block?.timestamp),
        blockNumber: Number(executedEvent.blockNumber),
        args: {
          proposalId: String(executedEvent.args.proposalId),
        },
      };
    }
    return null;
  }

  async getProposals(): Promise<Array<MProposal>> {
    const rawLogs = await this.client.getLogs({
      address: this.contract as Hash,
      fromBlock: this.fromBlock,
      event: parseAbiItem(
        "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] callDatas, uint256 voteStart, uint256 voteEnd, string description)"
      ),
    });

    if (rawLogs.length === 0) {
      return [];
    }

    const rawExecutedLogs = await this.getRawExecutedLogs();

    const proposals = rawLogs.map((log: Log) =>
      this.decodeProposalLog(log, this.abi)
    );

    console.log({ governanceType: this.governanceType, proposals });

    const contractCallsGetProposal = proposals.map((p) => ({
      abi: this.abi,
      address: this.contract,
      functionName: "getProposal",
      args: [BigInt(p.proposalId)],
    }));

    const defaultMulticall3 = this.client.chain?.contracts?.multicall3?.address;
    const proposalsWithGetProposal = (
      await this.client.multicall({
        multicallAddress: (this.config.multicall3 ?? defaultMulticall3) as Hash,
        contracts: contractCallsGetProposal,
      })
    ).map((res) => res.result);

    console.log({
      governanceType: this.governanceType,
      proposalsWithGetProposal,
    });

    const proposalsWithTallies = await Promise.all(
      proposals.map(async (proposal, index) => {
        const proposalData = this.decodeReadGetProposal(
          proposalsWithGetProposal[index]
        );

        const proposalPresented = await this.presenterProposal({
          proposal,
          readGetProposal: proposalData,
        });

        const executedEvent = await this.findExecutedEvent(
          proposal?.proposalId,
          rawExecutedLogs
        );

        if (executedEvent) {
          return {
            ...proposalPresented,
            executedEvent,
          };
        } else {
          return proposalPresented;
        }
      })
    );

    return proposalsWithTallies;
  }

  async getProposalFromWatchLog({
    eventName,
    args,
    ...log
  }: any): Promise<MProposal> {
    const calldataContent = args.callDatas[0] as Hash;

    const selector = bytesToHex(fromHex(calldataContent, "bytes").slice(0, 4));

    const isEmergency = this.isEmergencyProposal();

    const { proposalType, params } = this.decodeProposalTypes(
      selector,
      calldataContent
    );

    const proposalLabel =
      ProposalLabels[proposalType as keyof typeof ProposalLabels];

    const proposal: MProposal = {
      isEmergency,
      eventName,
      blockNumber: Number(log.blockNumber),
      transactionHash: String(log.transactionHash),
      values: this.toString(args.values),
      signatures: this.toString(args.signatures!),
      calldatas: this.toString(args.callDatas),
      targets: this.toString(args.targets!),
      voteStart: args.voteStart,
      voteEnd: args.voteEnd,
      proposer: args.proposer,
      description: args.description,
      timestamp: 0,
      proposalId: String(args.proposalId),
      proposalType: String(proposalType),
      proposalParams: this.toString([...params]),
      proposalLabel,
      governor: this.contract,
    };

    const readGetProposal = await this.readGetProposal(
      proposal.proposalId.toString()
    );

    const proposalPresented = await this.presenterProposal({
      proposal,
      readGetProposal,
    });

    return proposalPresented;
  }
}
