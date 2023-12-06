import {
  Abi,
  Hash,
  Log,
  bytesToHex,
  decodeAbiParameters,
  decodeEventLog,
  fromHex,
  getFunctionSelector,
  parseAbiItem,
} from "viem";

import pick from "lodash/pick";
import { readContract } from "@wagmi/core";
import {
  hexToBytes32String,
  removeSelectorFromCallData,
} from "../../../../utils";

import { GovernorModule } from "../GovernorModule";
import { GovernanceType } from "../../governor.types";
import {
  GetProposalOutput,
  MProposal,
  MProposalTallies,
  ProposalEventLog,
  ProposalState,
  VotingType,
} from "./proposal.types";
import { readDualGovernor } from "@/lib/sdk";
import { ApiContext } from "@/lib/api/api-context";
import { Epoch } from "~/lib/api/modules/epoch/epoch";

const ProposalTypesFunctionSelectors = {
  addToList: getFunctionSelector("addToList(bytes32,address)"),
  removeFromList: getFunctionSelector("removeFromList(bytes32,address)"),
  removeFromAndAddToList: getFunctionSelector(
    "removeFromAndAddToList(bytes32,address,address)"
  ),

  updateConfig: getFunctionSelector("updateConfig(bytes32,bytes32)"),

  resetToPowerHolders: getFunctionSelector("resetToPowerHolders()"),
  resetToZeroHolders: getFunctionSelector("resetToZeroHolders()"),
  setProposalFee: getFunctionSelector("setProposalFee(uint256)"),
  setCashToken: getFunctionSelector("setCashToken(address,uint256)"),
  emergencySetProposalFee: getFunctionSelector(
    "emergencySetProposalFee(uint256)"
  ),
  setPowerTokenThresholdRatio: getFunctionSelector("setThresholdRatio(uint16)"),
  setZeroTokenThresholdRatio: getFunctionSelector(
    "setZeroTokenThresholdRatio(uint16)"
  ),
};

const ProposalLabels = {
  setProposalFee: "Change Proposal Fee",
  addToList: "Add to list",
  removeFromList: "Remove from list",
  removeFromAndAddToList: "Remove from and Add to List",
  updateConfig: "Update Config",
  resetToPowerHolders: "Reset to Power Holders",
  resetToZeroHolders: "Reset to Zero Holders",
  setPowerTokenThresholdRatio: "Update Power Threshold",
  setZeroTokenThresholdRatio: "Update Zero Threshold",
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
      params: [hexToBytes32String(params[0]), params[1]],
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
      params: [hexToBytes32String(params[0]), params[1]],
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
      params: [hexToBytes32String(params[0]), params[1], params[2]],
    };
  }

  decodeProposalTypeUpdateConfig(calldata: Hash, proposalType: string) {
    const params = decodeAbiParameters(
      [
        { name: "key_", type: "bytes32" },
        { name: "value_", type: "bytes32" },
      ],
      removeSelectorFromCallData(calldata)
    ).map(hexToBytes32String);
    return { proposalType, params };
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

  decodeProposalTypeSetPowerTokenThresholdRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newThresholdRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setPowerTokenThresholdRatio", params };
  }

  decodeProposalTypeSetZeroTokenThresholdRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newThresholdRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setZeroTokenThresholdRatio", params };
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

      case ProposalTypesFunctionSelectors.updateConfig:
        return this.decodeProposalTypeUpdateConfig(calldata, "updateConfig");
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

      case ProposalTypesFunctionSelectors.emergencySetProposalFee:
        return this.decodeProposalTypeSetProposalFee(
          calldata,
          "setProposalFee"
        );
        break;

      case ProposalTypesFunctionSelectors.setPowerTokenThresholdRatio:
        return this.decodeProposalTypeSetPowerTokenThresholdRatio(calldata);
        break;

      case ProposalTypesFunctionSelectors.setZeroTokenThresholdRatio:
        return this.decodeProposalTypeSetZeroTokenThresholdRatio(calldata);
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

    console.log({ eventName, args });
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
    const [voteStart, voteEnd, executed, state, noVotes, yesVotes, proposer] =
      proposal;

    return {
      proposer: proposer as Hash,
      voteStart,
      voteEnd,
      executed,
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
    const getProposal = await readContract({
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

    const epoch = Epoch.getEpochFromBlock(BigInt(proposal.blockNumber));

    return {
      ...proposal,
      ...pick(readGetProposal, [
        "proposer",
        "voteStart",
        "voteEnd",
        "executed",
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

    console.log({ rawLogs });
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

    // const getProposal = await Promise.all(
    //   proposals.map((p) =>
    //     readContract({
    //       abi: this.abi,
    //       address: this.contract,
    //       functionName: "getProposal",
    //       args: [BigInt(p.proposalId)],
    //     })
    //   )
    // );
    // console.log({ getProposal });

    // console.log({
    //   contract: this.contract,
    //   governanceType: this.governanceType,
    // });

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

        return proposalPresented;
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
