import { Abi, Hash, Log, decodeEventLog, parseAbiItem } from "viem";
import orderBy from "lodash/orderBy";

import { MUpdateConfigEvent, MProtocolConfig } from "./protocol-configs.types";

import { registrarABI } from "~/lib/sdk";
import { hexToBytes32String } from "~/lib/api/utils";
import { ApiModule } from "~/lib/api/api-module";

export class ProtocolConfigs extends ApiModule {
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

      const updateConfigEvent: MUpdateConfigEvent = {
        ...event,
        eventName,
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        key: hexToBytes32String(event.key),
        value: hexToBytes32String(event.value),
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
}
