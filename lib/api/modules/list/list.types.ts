import { Hash } from "viem";
import { EventLog } from "../event/event.types";

export interface MListEvent extends EventLog {
  eventName: "AddressAddedToList" | "AddressRemovedFromList";
  listName: string;
  account: string;
  timestamp: number;
}

export interface MLists {
  [listName: string]: Array<MListEvent>;
}

export interface MListDecoded {
  eventName: string;
  args: { listName: Hash; account: Hash };
}
