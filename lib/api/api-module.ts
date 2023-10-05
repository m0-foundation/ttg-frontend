import { Abi, Hash, PublicClient } from "viem";
import { IApiConfig } from "./types";
import { ApiContext } from "./api-context";

export class ApiModule {
  client: PublicClient;
  config: IApiConfig;

  constructor(context: ApiContext) {
    this.client = context.client;
    this.config = context.config;
  }

  async get<T>(
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

        return {
          [key]: typeof r.result === "bigint" ? String(r.result) : r.result,
        };
      });

      const params = keys.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});

      console.log("Get Params", params);
      return params as T;
    };

    const defaultMulticall3 = this.client.chain?.contracts?.multicall3?.address;
    // if chain is hardhat then will be undefined

    const results = await this.client.multicall({
      multicallAddress: (this.config.multicall3 ?? defaultMulticall3) as Hash,
      contracts: contractCalls,
    });
    return decodeResults(results);
  }
}
