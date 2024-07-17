import { Hash } from "viem";

import { ApiModule } from "../../api-module";
import { ApiContext } from "../../api-context";
import { ProtocolConfigs } from "./protocol-configs";

import { List } from "./modules/list";
import { MRegistrarValues } from "./registrar.types";
import { registrarAbi } from "@/lib/sdk";

export class Registrar extends ApiModule {
  protocolConfigs: ProtocolConfigs;
  list: List;

  constructor(context: ApiContext) {
    super(context);
    this.protocolConfigs = new ProtocolConfigs(context);
    this.list = new List(context);
  }

  getParameters<T>(parameters: string[]): Promise<T> {
    return this.get<T>(parameters, {
      address: this.config.registrar as Hash,
      abi: registrarAbi,
    });
  }

  getValues(): Promise<MRegistrarValues> {
    return this.getParameters<MRegistrarValues>([
      "standardGovernor",
      "zeroGovernor",
      "emergencyGovernor",
      "powerToken",
      "zeroToken",
      "vault",
      "clock",
      "clockPeriod",
      "clockStartingTimestamp",
    ]);
  }
}
