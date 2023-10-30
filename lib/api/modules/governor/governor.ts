import { Hash } from "viem";

import { ApiModule } from "../../api-module";
import { ApiContext } from "../../api-context";
import { MGovernorContracts, MGovernorValues } from "./governor.types";
import { Proposals } from "./modules/proposal";
import { Voting } from "./modules/voting";
import { Epoch } from "./modules/epoch";
import { dualGovernorABI } from "@/lib/sdk";

export class Governor extends ApiModule {
  contract: Hash;

  proposals: Proposals;
  voting: Voting;
  epoch: Epoch;

  constructor(contract: Hash, context: ApiContext) {
    super(context);
    this.contract = contract;

    this.proposals = new Proposals(contract, context);
    this.voting = new Voting(contract, context);
    this.epoch = new Epoch(contract, context);
  }

  getParameters<T>(parameters: string[]): Promise<T> {
    return this.get<T>(parameters, {
      address: this.contract!,
      abi: dualGovernorABI,
    });
  }

  getContracts(): Promise<Partial<MGovernorContracts>> {
    return this.getParameters<Partial<MGovernorContracts>>([
      "registrar",
      "cashToken",
      "zeroToken",
      "powerToken",
    ]);
  }

  getValues(): Promise<Partial<MGovernorValues>> {
    return this.getParameters<Partial<MGovernorValues>>([
      "powerTokenQuorumRatio",
      "zeroTokenQuorumRatio",
      "proposalFee",
      "minProposalFee",
      "maxProposalFee",
      "clock",
      "votingDelay",
      "votingPeriod",
    ]);
  }
}
