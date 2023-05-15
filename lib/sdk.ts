import { createPublicClient, http, decodeEventLog } from "viem";
import { spogABI, ispogGovernorABI } from "./generated";

export interface M0EventLog {
  eventName: string;
  description: string;
  proposalId: BigInt;
  calldatas: Array<string>;
  endBlock: BigInt;
  startBlock: BigInt;
  proposer: string;
  signatures: Array<string>;
  targets: Array<string>;
  values: Array<any>;
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
  client: Client;

  constructor(rpcUrl: string, chain: Chain, config: ConfigVars) {
    this.client = createPublicClient({ chain, transport: http(rpcUrl) });
    this.config = config;
  }

  decodeRawLog(log: object, abi: object) {
    const { eventName, args } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    });
    return { eventName, ...args };
  }

  async getGovernorVoteProposals(
    fromBlock?: BigInt = BigInt(this.config.deployedBlock)
  ): Promise<M0EventLog[]> {
    const rawLogs = await this.client.getLogs({
      address: this.config.governor.vote,
      fromBlock,
    });

    return rawLogs.map((log) => this.decodeRawLog(log, ispogGovernorABI));
  }

  async getSpogProposals(
    fromBlock?: BigInt = BigInt(this.config.deployedBlock)
  ): Promise<M0EventLog[]> {
    const rawLogs = await this.client.getLogs({
      address: this.config.spog,
      fromBlock,
    });

    return rawLogs.map((log) => this.decodeRawLog(log, spogABI));
  }
}
