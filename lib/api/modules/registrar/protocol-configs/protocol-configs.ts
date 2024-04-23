import { Hash, decodeAbiParameters, hexToString } from "viem";

import { registrarAbi } from "@/lib/sdk";
import {
  hexWith32BytesToAddress,
  stringToHexWith32Bytes,
} from "@/lib/api/utils";
import { ApiModule } from "@/lib/api/api-module";
import { getIpfsHashFromBytes32 } from "@/utils/ipfs";
import { decode } from "bs58";

export class ProtocolConfigs extends ApiModule {
  keysInBytes32 = [
    "update_collateral_interval",
    "update_collateral_threshold",
    "penalty_rate",
    "mint_delay",
    "mint_ttl",
    "mint_ratio",
    "minter_freeze_time",
    "base_minter_rate",
    "max_earner_rate",
    "guidance",
  ];

  keysInAddress = ["minter_rate_model", "earner_rate_model"];

  async getAllProtocolKeysAndValues(): Promise<
    Array<{ key: string; value: any }>
  > {
    const valuesBytes = await this.client.readContract({
      abi: registrarAbi,
      address: this.config.registrar as Hash,
      functionName: "get",
      args: [this.keysInBytes32.map(stringToHexWith32Bytes)],
    });

    const decodeValue = (key: string, value: string) => {
      if (["guidance"].includes(key)) {
        return getIpfsHashFromBytes32(value);
      }
      return String(decodeAbiParameters([{ type: "uint256" }], value as Hash));
    };

    const keyValuesBytes = this.keysInBytes32.map((key, index) => ({
      key,
      value: decodeValue(key, valuesBytes[index]),
    }));

    const valuesAddress = await this.client.readContract({
      abi: registrarAbi,
      address: this.config.registrar as Hash,
      functionName: "get",
      args: [this.keysInAddress.map(stringToHexWith32Bytes)],
    });

    const keyValuesAddress = this.keysInAddress
      .map((key, index) => ({
        key,
        value: hexWith32BytesToAddress(valuesAddress[index] as Hash),
      }))
      .filter((obj) => obj.value !== "0x00");

    return [...keyValuesBytes, ...keyValuesAddress];
  }
}
