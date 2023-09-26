import { Abi, Hash } from "viem";

import { ApiModule, ApiContext } from "../..";
import { MGovernorState } from "./governor.types";

import { dualGovernorABI } from "~/lib/sdk";

export class Governor extends ApiModule {
  contract: Hash;

  constructor(context: ApiContext) {
    super(context);
    this.contract = this.config.contracts!.governor as Hash;
  }

  get<T>(
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

    const defaultMulticall3 = this.client.chain?.contracts?.multicall3?.address;
    // if chain is hardhat then will be undefined

    return this.client
      .multicall({
        multicallAddress: (this.config.multicall3 ?? defaultMulticall3) as Hash,
        contracts: contractCalls,
      })
      .then(decodeResults);
  }

  getParameters<T>(parameters: string[]): Promise<T> {
    return this.get<T>(parameters, {
      address: this.contract,
      abi: dualGovernorABI,
    });
  }

  getState(): Promise<Partial<MGovernorState>> {
    return this.getParameters<Partial<MGovernorState>>([
      "powerTokenQuorumRatio",
      "zeroTokenQuorumRatio",
      "proposalFee",
      "minProposalFee",
      "maxProposalFee",
      "clock",
      "cashToken",
      "zeroToken",
      "powerToken",
    ]);
    // votingDelay
    // votingPeriod
  }
}
