import { Hash } from "viem";

import { ApiModule } from "../../api-module";
import { MRegistrarState } from "./registrar.types";

import { registrarABI } from "~/lib/sdk";

export class Registrar extends ApiModule {
  getParameters<T>(parameters: string[]): Promise<T> {
    return this.get<T>(parameters, {
      address: this.config.registrar as Hash,
      abi: registrarABI,
    });
  }

  getContracts(): Promise<Partial<MRegistrarState>> {
    return this.getParameters<Partial<MRegistrarState>>(["governor"]);
  }
}
