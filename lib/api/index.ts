import { createPublicClient, http, PublicClient } from "viem";
import { Proposals } from "./modules/proposal";
import { Voting } from "./modules/voting";
import { List } from "./modules/list";
import { ProtocolConfigs } from "./modules/protocol-configs";
import { Governor } from "./modules/governor";
import { MVotingTokens } from "./modules/voting/voting.types";
import { IApiConfig } from "./types";

export const MProposalEmergencyVotingTokens = {
  addToList: [MVotingTokens.Power],
  removeFromList: [MVotingTokens.Power],
  updateConfig: [MVotingTokens.Power],
};

export const MProposalVotingTokens = {
  addToList: [MVotingTokens.Power],
  removeFromList: [MVotingTokens.Power],
  updateConfig: [MVotingTokens.Power],
  reset: [MVotingTokens.Zero],
  updateVoteQuorumNumerator: [MVotingTokens.Power, MVotingTokens.Zero],
  updateValueQuorumNumerator: [MVotingTokens.Power, MVotingTokens.Zero],
  changeTax: [MVotingTokens.Power],
  changeTaxRange: [MVotingTokens.Power, MVotingTokens.Zero],
  emergency: { ...MProposalEmergencyVotingTokens },
};

export class ApiModule {
  client: PublicClient;
  config: IApiConfig;

  constructor(context: ApiContext) {
    this.client = context.client;
    this.config = context.config;
  }
}

export class ApiContext {
  client: PublicClient;
  config: IApiConfig;

  constructor(client: PublicClient, config: IApiConfig) {
    this.client = client;
    this.config = config;
  }
}

export class Api {
  private context: ApiContext;

  proposals: Proposals;
  voting: Voting;
  list: List;
  protocolConfigs: ProtocolConfigs;
  governor: Governor;

  constructor(rpcUrl: string, config: IApiConfig) {
    const client = createPublicClient({ transport: http(rpcUrl) });
    this.context = new ApiContext(client, config);

    this.proposals = new Proposals(this.context);
    this.voting = new Voting(this.context);
    this.list = new List(this.context);
    this.protocolConfigs = new ProtocolConfigs(this.context);
    this.governor = new Governor(this.context);
  }

  setRpc(rpcUrl: string) {
    this.context.client = createPublicClient({ transport: http(rpcUrl) });
  }

  addConfig(config: Partial<IApiConfig>): void {
    this.context.config = { ...this.context.config, ...config };
  }
}
