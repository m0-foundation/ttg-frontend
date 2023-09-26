import { Abi, Hash, Log, decodeEventLog, parseAbiItem } from "viem";
import orderBy from "lodash/orderBy";

import { ApiContext, ApiModule } from "../..";
import { hexToBytes32String } from "../../utils";
import { MUpdateConfigEvent, MProtocolConfig } from "./protocol-configs.types";

import { dualGovernorABI } from "~/lib/sdk";

export class ProtocolConfigs extends ApiModule {
  contract: Hash;

  constructor(context: ApiContext) {
    super(context);
    this.contract = this.config.contracts?.governor as Hash;
  }

  async decodeProtocolConfigLog(
    log: Log,
    abi: Abi
  ): Promise<MUpdateConfigEvent> {
    interface MProtocolConfigDecoded {
      eventName: string;
      args: { valueName: Hash; value: Hash };
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
        valueName: hexToBytes32String(event.valueName),
        value: hexToBytes32String(event.value),
        timestamp: Number(block.timestamp),
      };

      return updateConfigEvent;
    }

    return {} as MUpdateConfigEvent;
  }

  async getProtocolConfigs(): Promise<MProtocolConfig> {
    const rawLogs = await this.client.getLogs({
      address: this.contract,
      fromBlock: 0n,
      event: parseAbiItem(
        "event ConfigUpdated(bytes32 valueName, bytes32 value)"
      ),
    });

    const decodedLogs = await Promise.all(
      rawLogs.map((log: Log) =>
        this.decodeProtocolConfigLog(log, dualGovernorABI)
      )
    );

    const orderedLogs = orderBy([...decodedLogs], ["blockNumber"], ["asc"]);

    const finalConfig = {} as MProtocolConfig;

    // guaranteed order
    for (const event of orderedLogs) {
      finalConfig[event.valueName] = {
        value: event.value,
        timestamp: event.timestamp,
      };
    }

    return finalConfig;
  }
}
