export * from "./modules/governor/governor.types";
export * from "./modules/governor/modules/proposal/proposal.types";
export * from "./modules/governor/modules/epoch/epoch.types";
export * from "./modules/registrar/modules/list/list.types";
export * from "./modules/registrar/protocol-configs/protocol-configs.types";
export * from "./modules/governor/modules/voting/voting.types";

export interface IApiConfig {
  multicall3: `0x${string}`;
  registrar: string;
  deploymentBlock: bigint;
}
