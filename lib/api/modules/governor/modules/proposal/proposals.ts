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
  parseAbiParameters,
} from "viem";

import {
  hexToBytes32String,
  removeSelectorFromCallData,
} from "../../../../utils";

import { GovernorModule } from "../GovernorModule";
import { MProposal, ProposalEventLog, ProposalState } from "./proposal.types";
import { dualGovernorABI, readDualGovernor } from "@/lib/sdk";
import { ApiContext } from "@/lib/api/api-context";

const ProposalTypesFunctionSelectors = {
  addToList: getFunctionSelector("addToList(bytes32,address)"),
  removeFromList: getFunctionSelector("removeFromList(bytes32,address)"),
  updateConfig: getFunctionSelector("updateConfig(bytes32,bytes32)"),
  emergencyAddToList: getFunctionSelector(
    "emergencyAddToList(bytes32,address)"
  ),
  emergencyRemoveFromList: getFunctionSelector(
    "emergencyRemoveFromList(bytes32,address)"
  ),
  emergencyUpdateConfig: getFunctionSelector(
    "emergencyUpdateConfig(bytes32,address)"
  ),

  reset: getFunctionSelector("reset()"),
  setProposalFee: getFunctionSelector("setProposalFee(uint256)"),
  setProposalFeeRange: getFunctionSelector(
    "setProposalFeeRange(uint256,uint256,uint256)"
  ),
  setPowerTokenQuorumRatio: getFunctionSelector(
    "setPowerTokenQuorumRatio(uint16)"
  ),
  setZeroTokenQuorumRatio: getFunctionSelector(
    "setZeroTokenQuorumRatio(uint16)"
  ),
};

const ProposalLabels = {
  setProposalFee: "Change Proposal Fee",
  setProposalFeeRange: "Change Tax Range",
  addToList: "Add to list",
  removeFromList: "Remove from list",
  updateConfig: "Update Config",
  reset: "Reset",
  setPowerTokenQuorumRatio: "Update Power Quorum",
  setZeroTokenQuorumRatio: "Update Zero Quorum",
};

type IParams =
  | readonly [`0x${string}`, `0x${string}`]
  | readonly [bigint]
  | readonly [bigint, bigint]
  | readonly [bigint, bigint, bigint]
  | readonly [number]
  | string[]
  | string;

export class Proposals extends GovernorModule {
  fromBlock: bigint;

  constructor(governor: Hash, context: ApiContext) {
    super(governor, context);

    this.fromBlock = 1n; // is necessary for getLogs, otherwise gets from latest blocks, but inrelanvent for peforfmance
  }

  decodeProposalTypeAddToList(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "list_", type: "bytes32" },
        { name: "account_", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType: "addToList",
      params: [hexToBytes32String(params[0]), params[1]],
    };
  }

  decodeProposalRemoveFromList(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "list_", type: "bytes32" },
        { name: "account_", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType: "removeFromList",
      params: [hexToBytes32String(params[0]), params[1]],
    };
  }

  decodeProposalTypeUpdateConfig(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "key_", type: "bytes32" },
        { name: "value_", type: "bytes32" },
      ],
      removeSelectorFromCallData(calldata)
    ).map(hexToBytes32String);
    return {
      proposalType: "updateConfig",
      params,
    };
  }

  decodeProposalTypeReset(calldata: Hash) {
    const params = decodeAbiParameters(
      [],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType: "reset",
      params,
    };
  }

  decodeProposalTypeSetProposalFee(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newProposalFee_", type: "uint256" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setProposalFee", params };
  }

  decodeProposalTypeSetProposalFeeRange(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "newMinProposalFee_", type: "uint256" },
        { name: "newMaxProposalFee_", type: "uint256" },
        { name: "newProposalFee_", type: "uint256" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setProposalFeeRange", params };
  }

  decodeProposalTypeSetPowerTokenQuorumRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newPowerTokenQuorumRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setPowerTokenQuorumRatio", params };
  }

  decodeProposalTypeSetZeroTokenQuorumRatio(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newZeroTokenQuorumRatio_", type: "uint16" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "setZeroTokenQuorumRatio", params };
  }

  decodeProposalTypes(
    selector: Hash,
    calldata: Hash
  ): { proposalType: string; params: IParams } {
    switch (selector) {
      case ProposalTypesFunctionSelectors.addToList ||
        ProposalTypesFunctionSelectors.emergencyAddToList:
        return this.decodeProposalTypeAddToList(calldata);
        break;
      case ProposalTypesFunctionSelectors.removeFromList ||
        ProposalTypesFunctionSelectors.emergencyRemoveFromList:
        return this.decodeProposalRemoveFromList(calldata);
        break;
      case ProposalTypesFunctionSelectors.updateConfig ||
        ProposalTypesFunctionSelectors.emergencyUpdateConfig:
        return this.decodeProposalTypeUpdateConfig(calldata);
        break;
      case ProposalTypesFunctionSelectors.reset:
        return this.decodeProposalTypeReset(calldata);
        break;
      case ProposalTypesFunctionSelectors.setProposalFee:
        return this.decodeProposalTypeSetProposalFee(calldata);
        break;
      case ProposalTypesFunctionSelectors.setProposalFeeRange:
        return this.decodeProposalTypeSetProposalFeeRange(calldata);
        break;
      case ProposalTypesFunctionSelectors.setPowerTokenQuorumRatio:
        return this.decodeProposalTypeSetPowerTokenQuorumRatio(calldata);
        break;
      case ProposalTypesFunctionSelectors.setZeroTokenQuorumRatio:
        return this.decodeProposalTypeSetZeroTokenQuorumRatio(calldata);
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
      event.calldatas = event.calldatas as Array<Hash>;

      const calldata = event.calldatas[0] as Hash;

      const selector = bytesToHex(
        fromHex(event.calldatas[0] as Hash, "bytes").slice(0, 4)
      );

      const isEmergency = [
        ProposalTypesFunctionSelectors.emergencyAddToList,
        ProposalTypesFunctionSelectors.emergencyRemoveFromList,
        ProposalTypesFunctionSelectors.emergencyUpdateConfig,
      ].includes(selector);

      const { proposalType, params } = this.decodeProposalTypes(
        selector,
        calldata
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
        endBlock: Number(event.endBlock),
        startBlock: Number(event.startBlock),
        proposer: event.proposer,
        description: event.description,
        timestamp: event.timestamp,
        proposalId: String(event.proposalId),
        proposalType: String(proposalType),
        proposalParams: this.toString([...params]),
        proposalLabel,
      };

      return proposal;
    }

    return {} as MProposal;
  }

  async getProposalState(
    proposalId: string
  ): Promise<keyof typeof ProposalState> {
    const proposalStateNumber = await readDualGovernor({
      address: this.contract,
      functionName: "state",
      args: [BigInt(proposalId)],
    });

    return ProposalState[proposalStateNumber] as keyof typeof ProposalState;
  }

  async getProposals(): Promise<Array<MProposal>> {
    const rawLogs = await this.client.getLogs({
      address: this.contract as Hash,
      fromBlock: this.fromBlock,
      event: parseAbiItem(
        "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)"
      ),
    });

    const proposals = rawLogs.map((log: Log) =>
      this.decodeProposalLog(log, dualGovernorABI)
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
}
