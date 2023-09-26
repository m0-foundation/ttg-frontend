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

import { hexToBytes32String, removeSelectorFromCallData } from "../../utils";
import { ApiContext, ApiModule } from "../..";
import { MProposal, ProposalEventLog, ProposalState } from "./proposal.types";
import { dualGovernorABI, readDualGovernor } from "@/lib/sdk";

const ProposalTypesFunctionSelectors = {
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

const ProposalLabels = {
  changeTax: "Change Tax",
  changeTaxRange: "Change Tax Range",
  addToList: "Add to list",
  removeFromList: "Remove from list",
  updateConfig: "Update Config",
  reset: "Reset Vote Holders",
  updateVoteQuorumNumerator: "Update Vote Quorum",
  updateValueQuorumNumerator: "Update Value Quorum",
};

type IParams =
  | readonly [`0x${string}`, `0x${string}`]
  | readonly [bigint]
  | readonly [bigint, bigint]
  | string[];

export class Proposals extends ApiModule {
  fromBlock: bigint;

  constructor(context: ApiContext) {
    super(context);

    this.fromBlock = 1n; // is necessary for getLogs, otherwise gets from latest blocks, but inrelanvent for peforfmance
  }

  decodeProposalTypeAddToList(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "list", type: "bytes32" },
        { name: "account", type: "address" },
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
        { name: "list", type: "bytes32" },
        { name: "account", type: "address" },
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
        { name: "valueName", type: "bytes32" },
        { name: "value", type: "bytes32" },
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
      [
        { name: "newGovernor", type: "address" },
        { name: "newVoteVault", type: "address" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return {
      proposalType: "reset",
      params,
    };
  }

  decodeProposalTypeChangeTax(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newTax", type: "uint256" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "changeTax", params };
  }

  decodeProposalTypeChangeTaxRange(calldata: Hash) {
    const params = decodeAbiParameters(
      [
        { name: "newTaxLowerBound", type: "uint256" },
        { name: "newTaxUpperBound", type: "uint256" },
      ],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "changeTaxRange", params };
  }

  decodeProposalTypeUpdateVoteQuorumNumerator(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newVoteQuorumNumerator", type: "uint256" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "updateVoteQuorumNumerator", params };
  }

  decodeProposalTypeUpdateValueQuorumNumerator(calldata: Hash) {
    const params = decodeAbiParameters(
      [{ name: "newValueQuorumNumerator", type: "uint256" }],
      removeSelectorFromCallData(calldata)
    );
    return { proposalType: "updateValueQuorumNumerator", params };
  }

  parseEmergency(emergencyType: number, callData: Hash) {
    if (emergencyType === 0) {
      const values = decodeAbiParameters(
        parseAbiParameters("bytes32 list, address account"),
        callData
      );

      return {
        proposalType: "removeFromList",
        params: [hexToBytes32String(values[0]), values[1]],
      };
    } else if (emergencyType === 1) {
      const values = decodeAbiParameters(
        parseAbiParameters("bytes32 list, address account"),
        callData
      );

      return {
        proposalType: "addToList",
        params: [hexToBytes32String(values[0]), values[1]],
      };
    } else {
      // if (emergencyType === 2)
      const values = decodeAbiParameters(
        [
          { name: "valueName", type: "bytes32" },
          { name: "value", type: "bytes32" },
        ],
        callData
      ).map(hexToBytes32String);

      return { proposalType: "updateConfig", params: values };
    }
  }

  decodeProposalTypeEmergency(calldata: Hash) {
    const values = decodeAbiParameters(
      [
        { name: "emergencyType", type: "uint8" },
        { name: "callData", type: "bytes" },
      ],
      removeSelectorFromCallData(calldata)
    );

    const { proposalType, params } = this.parseEmergency(values[0], values[1]);

    return { proposalType, params };
  }

  decodeProposalTypes(
    selector: Hash,
    calldata: Hash
  ): { proposalType: string; params: IParams } {
    switch (selector) {
      case ProposalTypesFunctionSelectors.addToList:
        return this.decodeProposalTypeAddToList(calldata);
        break;
      case ProposalTypesFunctionSelectors.removeFromList:
        return this.decodeProposalRemoveFromList(calldata);
        break;
      case ProposalTypesFunctionSelectors.updateConfig:
        return this.decodeProposalTypeUpdateConfig(calldata);
        break;
      case ProposalTypesFunctionSelectors.reset:
        return this.decodeProposalTypeReset(calldata);
        break;
      case ProposalTypesFunctionSelectors.changeTax:
        return this.decodeProposalTypeChangeTax(calldata);
        break;
      case ProposalTypesFunctionSelectors.changeTaxRange:
        return this.decodeProposalTypeChangeTaxRange(calldata);
        break;
      case ProposalTypesFunctionSelectors.updateVoteQuorumNumerator:
        return this.decodeProposalTypeUpdateVoteQuorumNumerator(calldata);
        break;
      case ProposalTypesFunctionSelectors.updateValueQuorumNumerator:
        return this.decodeProposalTypeUpdateValueQuorumNumerator(calldata);
        break;
      default:
        // case ProposalTypesFunctionSelectors.emergency:
        return this.decodeProposalTypeEmergency(calldata);
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

      const isEmergency = selector === ProposalTypesFunctionSelectors.emergency;

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
      address: this.config.contracts!.governor as Hash,
      functionName: "state",
      args: [BigInt(proposalId)],
    });

    return ProposalState[proposalStateNumber] as keyof typeof ProposalState;
  }

  async getProposals(): Promise<Array<MProposal>> {
    const rawLogs = await this.client.getLogs({
      address: this.config.contracts!.governor as Hash,
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
