export * from "./modules/governor/governor.types";
export * from "./modules/governor/modules/proposal/proposal.types";
export * from "./modules/epoch/epoch.types";
export * from "./modules/registrar/modules/list/list.types";
export * from "./modules/registrar/protocol-configs/protocol-configs.types";
export * from "./modules/governor/modules/voting/voting.types";

export interface IApiConfig {
  multicall3: `0x${string}`;
  registrar: string;
  deploymentBlock: bigint;
}

export interface IToken {
  address: `0x${string}`;
  decimals: number | undefined;
  name: string | undefined;
  symbol: string | undefined;
  totalSupply: {
    formatted: string;
    value: bigint | undefined;
  };
}
