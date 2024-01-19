import { Abi, Hash, Log, decodeEventLog, parseAbiItem } from "viem";
import orderBy from "lodash/orderBy";

import { MUpdateConfigEvent, MProtocolConfig } from "./protocol-configs.types";

import { readRegistrar, registrarABI } from "~/lib/sdk";
import {
  hexWith32BytesToString,
  hexWith32BytesToAddress,
  stringToHexWith32Bytes,
} from "~/lib/api/utils";
import { ApiModule } from "~/lib/api/api-module";

export class ProtocolConfigs extends ApiModule {
  keysInBytes32 = [
    "update_collateral_interval",
    "update_collateral_threshold",
    "penalty_rate",
    "mint_delay",
    "mint_ttl",
    "mint_ratio",
    "minter_freeze_time",
  ];

  keysInAddress = ["earner_rate_model", "earner_rate_model"];

  async decodeProtocolConfigLog(
    log: Log,
    abi: Abi
  ): Promise<MUpdateConfigEvent> {
    interface MProtocolConfigDecoded {
      eventName: string;
      args: { key: Hash; value: Hash };
    }

    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    }) as MProtocolConfigDecoded;

    if (event) {
      const block = await this.client.getBlock({
        blockNumber: log.blockNumber!,
      });

      const key = hexWith32BytesToString(event.key);
      const value = ["minter_rate_model", "earner_rate_model"].includes(key)
        ? hexWith32BytesToAddress(event.value)
        : hexWith32BytesToString(event.value);

      const updateConfigEvent: MUpdateConfigEvent = {
        ...event,
        eventName,
        key,
        value,
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        timestamp: Number(block.timestamp),
      };

      return updateConfigEvent;
    }

    return {} as MUpdateConfigEvent;
  }

  async getProtocolConfigs(): Promise<MProtocolConfig> {
    const rawLogs = await this.client.getLogs({
      address: this.config.registrar as Hash,
      fromBlock: this.config.deploymentBlock,
      event: parseAbiItem(
        "event KeySet(bytes32 indexed key, bytes32 indexed value)"
      ),
    });

    const decodedLogs = await Promise.all(
      rawLogs.map((log: Log) => this.decodeProtocolConfigLog(log, registrarABI))
    );

    const orderedLogs = orderBy([...decodedLogs], ["blockNumber"], ["asc"]);

    const finalConfig = {} as MProtocolConfig;

    // guaranteed order
    for (const event of orderedLogs) {
      finalConfig[event.key] = {
        value: event.value,
        timestamp: event.timestamp,
      };
    }

    return finalConfig;
  }

  async getAllProtocolKeysAndValues(): Promise<
    Array<{ key: string; value: any }>
  > {
    const valuesBytes = await readRegistrar({
      address: this.config.registrar as Hash,
      functionName: "get",
      args: [this.keysInBytes32.map(stringToHexWith32Bytes)],
    });

    const keyValuesBytes = this.keysInBytes32.map((key, index) => ({
      key: hexWith32BytesToString(key),
      value: hexWith32BytesToString(valuesBytes[index]),
    }));

    const valuesAddress = await readRegistrar({
      address: this.config.registrar as Hash,
      functionName: "get",
      args: [this.keysInAddress.map(stringToHexWith32Bytes)],
    });

    const keyValuesAddress = this.keysInAddress.map((key, index) => ({
      key: hexWith32BytesToString(key),
      value: hexWith32BytesToAddress(valuesAddress[index] as Hash),
    }));

    return [...keyValuesBytes, ...keyValuesAddress];
  }
}
