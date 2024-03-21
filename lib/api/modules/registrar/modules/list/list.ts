import { Abi, Hash, Log, decodeEventLog, parseAbiItem } from "viem";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";

import { MListDecoded, MListEvent, MLists } from "./list.types";
import { hexWith32BytesToString } from "@/lib/api/utils";
import { registrarAbi } from "@/lib/sdk";
import { ApiModule } from "@/lib/api/api-module";

export class List extends ApiModule {
  async decodeListLog(log: Log, abi: Abi): Promise<MListEvent> {
    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    }) as unknown as MListDecoded;

    if (event) {
      const block = await this.client.getBlock({
        blockNumber: log.blockNumber!,
      });

      const listEvent: MListEvent = {
        ...event,
        eventName: eventName as "AddressAddedToList" | "AddressRemovedFromList",
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        list: hexWith32BytesToString(event.list),
        account: event.account,
        timestamp: Number(block.timestamp),
      };

      console.log({ listEvent });

      return listEvent;
    }

    return {} as MListEvent;
  }

  async getLists(): Promise<Array<MLists>> {
    const addRawLogs = await this.client.getLogs({
      address: this.config.registrar as Hash,
      fromBlock: this.config.deploymentBlock,
      event: parseAbiItem(
        "event AddressAddedToList(bytes32 indexed list, address indexed account)",
      ),
    });

    const removeRawLogs = await this.client.getLogs({
      address: this.config.registrar as Hash,
      fromBlock: this.config.deploymentBlock,
      event: parseAbiItem(
        "event AddressRemovedFromList(bytes32 indexed list, address indexed account)",
      ),
    });

    const addOperations = await Promise.all(
      addRawLogs.map((log: Log) => this.decodeListLog(log, registrarAbi)),
    );

    const removeOperations = await Promise.all(
      removeRawLogs.map((log: Log) => this.decodeListLog(log, registrarAbi)),
    );

    const listGrouped = groupBy(
      orderBy(
        [...addOperations, ...removeOperations],
        ["blockNumber"],
        ["asc"],
      ),
      "list",
    );

    const lists: MLists[] = [];

    forEach(listGrouped, (events, key) => {
      let list = [];

      events.forEach((event: MListEvent) => {
        if (event.eventName === "AddressAddedToList") {
          list.push(event);
        }

        if (event.eventName === "AddressRemovedFromList") {
          list = list.filter((e) => e.account !== event.account);
        }
      });

      lists.push({ [key]: list });
    });

    return lists;
  }
}
