import { createPublicClient, Hash, http } from "viem";
import { IApiConfig } from "./types";
import { ApiContext } from "./api-context";
import { Registrar } from "./modules/registrar";
import { Governor } from "./modules/governor";

import { Epoch } from "./modules/epoch";
import {
  zeroGovernorABI,
  standardGovernorABI,
  emergencyGovernorABI,
} from "@/lib/sdk";
export { MVotingTokens } from "./modules/governor/modules/voting/voting.types";

const batchConfig = {
  batch: {
    wait: 200, // this is an eprical value, tested and it seems like 200 miliseconds is good to run all requests from multicall
  },
};

export class Api {
  context: ApiContext;
  registrar: Registrar;
  standardGovernor?: Governor;
  zeroGovernor?: Governor;
  emergencyGovernor?: Governor;
  epoch: Epoch;

  constructor(rpcUrl: string, config: IApiConfig) {
    const client = createPublicClient({
      transport: http(rpcUrl, batchConfig),
    });

    this.context = new ApiContext(client, config);

    this.registrar = new Registrar(this.context);

    this.epoch = new Epoch(client);
  }

  setRpc(rpcUrl: string) {
    this.context.client = createPublicClient({
      transport: http(rpcUrl, batchConfig),
    });
  }

  addConfig(config: Partial<IApiConfig>): void {
    this.context.config = { ...this.context.config, ...config };
  }

  setGovernors(governors: {
    standardGovernor: string;
    zeroGovernor: string;
    emergencyGovernor: string;
  }) {
    this.standardGovernor = new Governor(
      governors.standardGovernor as Hash,
      this.context,
      standardGovernorABI,
      "Standard"
    );

    this.zeroGovernor = new Governor(
      governors.zeroGovernor as Hash,
      this.context,
      zeroGovernorABI,
      "Zero"
    );

    this.emergencyGovernor = new Governor(
      governors.emergencyGovernor as Hash,
      this.context,
      emergencyGovernorABI,
      "Emergency"
    );
  }
}
