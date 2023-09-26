import { Abi, Hash, Log, decodeEventLog, parseAbiItem } from "viem";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";

import { ApiModule } from "../..";
import { hexToBytes32String } from "../../utils";
import { MListDecoded, MListEvent, MLists } from "./list.types";

import { dualGovernorABI } from "~/lib/sdk";

export class List extends ApiModule {
  async decodeListLog(log: Log, abi: Abi): Promise<MListEvent> {
    const { eventName, args: event } = decodeEventLog({
      abi,
      data: log?.data,
      topics: log?.topics,
    }) as MListDecoded;

    if (event) {
      const block = await this.client.getBlock({
        blockNumber: log.blockNumber!,
      });

      const listEvent: MListEvent = {
        ...event,
        eventName: eventName as "AddressAddedToList" | "AddressRemovedFromList",
        blockNumber: Number(log.blockNumber),
        transactionHash: String(log.transactionHash),
        listName: hexToBytes32String(event.listName),
        account: event.account,
        timestamp: Number(block.timestamp),
      };

      return listEvent;
    }

    return {} as MListEvent;
  }

  async getLists(): Promise<Array<MLists>> {
    const addRawLogs = await this.client.getLogs({
      address: this.config.contracts?.governor as Hash,
      fromBlock: 0n,
      event: parseAbiItem(
        "event AddressAddedToList(bytes32 listName, address account)"
      ),
    });

    const removeRawLogs = await this.client.getLogs({
      address: this.config.contracts?.governor as Hash,
      fromBlock: 0n,
      event: parseAbiItem(
        "event AddressRemovedFromList(bytes32 listName, address account)"
      ),
    });

    const addOperations = await Promise.all(
      addRawLogs.map((log: Log) => this.decodeListLog(log, dualGovernorABI))
    );

    const removeOperations = await Promise.all(
      removeRawLogs.map((log: Log) => this.decodeListLog(log, dualGovernorABI))
    );

    const listGrouped = groupBy(
      orderBy(
        [...addOperations, ...removeOperations],
        ["blockNumber"],
        ["asc"]
      ),
      "listName"
    );

    const lists: MLists[] = [];

    forEach(listGrouped, (events, key) => {
      let list = new Array<MListEvent>();

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
