import { Hash, decodeAbiParameters } from "viem";

import { registrarAbi } from "@/lib/sdk";
import { stringToHexWith32Bytes } from "@/lib/api/utils";
import { ApiModule } from "@/lib/api/api-module";
import { getIpfsHashFromBytes32 } from "@/utils/ipfs";

export class Guidances extends ApiModule {
  keysInBytes32 = [
    "guidance",
    "ecosystem_guidance",
    "collateral_guidance",
    "spv_operators_guidance",
    "validators_guidance",
    "minters_guidance",
    "mandatory_contract_guidance",
  ];

  async getAllGuidances(): Promise<Array<{ key: string; value: any }>> {
    const valuesBytes = await this.client.readContract({
      abi: registrarAbi,
      address: this.config.registrar as Hash,
      functionName: "get",
      args: [this.keysInBytes32.map(stringToHexWith32Bytes)],
    });

    const decodeValue = (key: string, value: string) => {
      if (key.includes("guidance")) {
        console.log("guidance", value, key)
        return value ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
          ? undefined
          : getIpfsHashFromBytes32(value);
      }
      return String(decodeAbiParameters([{ type: "uint256" }], value as Hash));
    };

    const keyValuesBytes = this.keysInBytes32.map((key, index) => ({
      key,
      value: decodeValue(key, valuesBytes[index]),
    }));

    return keyValuesBytes;
  }
}
