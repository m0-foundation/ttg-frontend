import { Abi, Hash } from "viem";

import { ApiModule } from "../../api-module";
import { ApiContext } from "../../api-context";
import { Proposals } from "./modules/proposal";
import { Voting } from "./modules/voting";
import { GovernanceType } from "./governor.types";

export class Governor extends ApiModule {
  contract: Hash;
  abi: any;

  proposals: Proposals;
  voting: Voting;

  constructor(
    contract: Hash,
    context: ApiContext,
    abi: Abi,
    governanceType: GovernanceType,
  ) {
    super(context);
    this.contract = contract;
    this.abi = abi;

    this.proposals = new Proposals(contract, context, abi, governanceType);
    this.voting = new Voting(contract, context);
  }

  getParameters<T>(parameters: string[]): Promise<T> {
    return this.get<T>(parameters, {
      address: this.contract!,
      abi: this.abi,
    });
  }
}
